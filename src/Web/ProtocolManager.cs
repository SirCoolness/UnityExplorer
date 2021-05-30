using System;
using System.IO;
using System.Runtime.InteropServices;
using Google.Protobuf;

namespace UnityExplorer.Web
{
    public class ProtocolManager
    {
        private static TcpServer Server;
        
        public static void Listen(TcpServer server)
        {
            Server = server;

            server.ClientConnected += (_, session) => OnConnected(session);
        }
        
        private static void OnConnected(WebSocketSession session)
        {
            session.BinaryMessageReceived += (_, message) => ExecuteInMain.ExecuteNextFrame(() => DecodeMessage(session, message));
        }

        private static void DecodeMessage(WebSocketSession session, byte[] message)
        {
            int commandId = BitConverter.ToInt32(message, 0);
            bool useTracker = BitConverter.ToBoolean(message, 4);
            int tracker = useTracker ? BitConverter.ToInt32(message, 5) : 0;
            bool hasData = BitConverter.ToBoolean(message, useTracker ? 9 : 5);

            int headersLen = useTracker ? 6 : 10;

            if (!ProtocolMap.ProtocolCache.Forward.HasEntry(commandId))
            {
                TcpServer.WriteLogSafe($"{session.Id} | WARNING: client sent invalid command. ignoring.");
                return;
            }

            var command = ProtocolMap.ProtocolCache.Forward[commandId];
            TcpServer.WriteLogSafe($"{session.Id} | Client sent [{command.FullName}]");
            
            WriteMessage(session, new PingResponse
            {
                Message = session.Id
            });
        }

        public static void WriteMessage(WebSocketSession session, IMessage data, Int32 tracker = -1)
        {
            var type = data.GetType();
            if (!ProtocolMap.ProtocolCache.Reverse.HasEntry(type))
            {
                TcpServer.WriteLogSafe($"{session.Id} | WARNING: attempted to send invalid command. ignoring.");
                return;
            }
            
            var useTracker = tracker != -1;
            
            using (var streamRaw = new MemoryStream())
            {
                var stream = new CodedOutputStream(streamRaw);
                
                stream.WriteInt32(ProtocolMap.ProtocolCache.Reverse[type]);
                stream.WriteBool(useTracker);
                if (useTracker)
                    stream.WriteInt32(tracker);
                stream.WriteBool(ProtocolMap.ProtocolAttributes[type].HasData);

                data.WriteTo(stream);
                
                stream.Flush();

                streamRaw.Seek(0, SeekOrigin.Begin);
                var res = streamRaw.ToArray();
                TcpServer.WriteLogSafe($"[{res.Length}, {stream.Position}] Sending: {BitConverter.ToString(res)}");
                // session.SendMessage(res, true);
                session.QueueMessage(res, true);
            }
        }
    }
}