using System;
using System.IO;
using System.Runtime.InteropServices;
using Google.Protobuf;

namespace UnityExplorer.Web
{
    public class ProtocolManager
    {
        public enum TrackerOrigin: byte
        {
            Client = 0,
            Server = 1
        }
        
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
            TrackerOrigin origin = useTracker && BitConverter.ToBoolean(message, 5) ? TrackerOrigin.Server : TrackerOrigin.Client;
            int tracker = useTracker ? BitConverter.ToInt32(message, 6) : 0;

            bool hasData = BitConverter.ToBoolean(message, useTracker ? 10 : 5);
            int headersLen = useTracker ? 6 : 11;

            if (!ProtocolMap.ProtocolCache.Forward.HasEntry(commandId))
            {
                TcpServer.WriteLogSafe($"{session.Id} | WARNING: client sent invalid command. ignoring.");
                return;
            }

            var command = ProtocolMap.ProtocolCache.Forward[commandId];
            TcpServer.WriteLogSafe($"{session.Id} | Client sent [{command.FullName}]");
            
            if (command == typeof(PingRequest))
                WriteMessage(session, new PingResponse
                {
                    Message = session.Id
                }, tracker, origin);
        }
        
        public static void WriteMessage(WebSocketSession session, IMessage data, Int32 tracker, TrackerOrigin origin)
            => WriteMessage(session, data, tracker, origin, true);
        
        public static void WriteMessage(WebSocketSession session, IMessage data, [Optional] Int32 tracker, [Optional] TrackerOrigin origin, bool useTracker = false)
        {
            var type = data.GetType();
            if (!ProtocolMap.ProtocolCache.Reverse.HasEntry(type))
            {
                TcpServer.WriteLogSafe($"{session.Id} | WARNING: attempted to send invalid command. ignoring.");
                return;
            }
            
            using (var streamRaw = new MemoryStream())
            {
                var stream = new CodedOutputStream(streamRaw);
                
                stream.WriteInt32(ProtocolMap.ProtocolCache.Reverse[type]);
                stream.WriteBool(useTracker);
                if (useTracker)
                {
                    stream.WriteBool(Convert.ToBoolean(origin));
                    stream.WriteInt32(tracker);
                }
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