using System;
using System.IO;
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
            bool hasData = BitConverter.ToBoolean(message, 4);

            if (!ProtocolMap.ProtocolCache.Forward.HasEntry(commandId))
            {
                TcpServer.WriteLogSafe($"{session.Id} | WARNING: client sent invalid command. ignoring.");
                return;
            }

            var command = ProtocolMap.ProtocolCache.Forward[commandId];
            TcpServer.WriteLogSafe($"{session.Id} | Client sent [{command.FullName}]");
        }
    }
}