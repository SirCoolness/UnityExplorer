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
            session.BinaryMessageReceived += (_, message) => ExecuteInMain.HandleError(() => DecodeMessage(session, message));
        }

        private static void DecodeMessage(WebSocketSession session, byte[] message)
        {
            int commandId = BitConverter.ToInt32(message, 0);
            bool useTracker = BitConverter.ToBoolean(message, 4);
            TrackerOrigin origin = useTracker && BitConverter.ToBoolean(message, 5) ? TrackerOrigin.Client : TrackerOrigin.Server;
            int tracker = useTracker ? BitConverter.ToInt32(message, 6) : 0;

            bool hasData = BitConverter.ToBoolean(message, useTracker ? 10 : 5);
            int headersLen = useTracker ? 6 : 11;

            if (!ProtocolMap.ProtocolCache.Forward.HasEntry(commandId))
            {
                TcpServer.WriteLogSafe($"{session.Id} | WARNING: client sent invalid command. ignoring.");
                return;
            }

            var command = ProtocolMap.ProtocolCache.Forward[commandId];
            
            TcpServer.WriteLogSafe($"{session.Id} | Recieved [{BitConverter.ToString(message)}] [{origin.ToString()}]");
            
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
            
            var streamRaw = new MemoryStream();

            streamRaw.Write(BitConverter.GetBytes(ProtocolMap.ProtocolCache.Reverse[type]), 0, 4);
            streamRaw.Write(BitConverter.GetBytes(useTracker), 0, 1);
            
            if (useTracker)
            {
                streamRaw.Write(BitConverter.GetBytes(Convert.ToBoolean(origin)), 0, 1);
                streamRaw.Write(BitConverter.GetBytes(tracker), 0, 4);
            }
            
            streamRaw.Write(BitConverter.GetBytes(ProtocolMap.ProtocolAttributes[type].HasData), 0, 1);
            
            data.WriteTo(streamRaw);

            // streamRaw.Seek(0, SeekOrigin.Begin);
            // streamRaw.GetBuffer();
            var res = streamRaw.ToArray();
            TcpServer.WriteLogSafe($"{session.Id} | Sending: {BitConverter.ToString(res)}");
            // session.SendMessage(res, true);
            session.QueueMessage(res, true);
            streamRaw.Dispose();
        }
    }
}