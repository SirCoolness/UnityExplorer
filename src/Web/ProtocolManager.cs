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
            session.BinaryMessageReceived += (_, message) => ExecuteInMain.ExecuteNextFrame(() => DecodeMessage(message));
        }

        private static void DecodeMessage(byte[] message)
        {
            int command = BitConverter.ToInt32(message, 0);
            bool hasData = BitConverter.ToBoolean(message, 4);

            // var parser = new MessageParser<PingRequest>(() => new PingRequest());
            // TcpServer.WriteLogSafe($"{command} {hasData}");
            // var parsed = parser.ParseFrom(message, 5, message.Length - 5);
            // TcpServer.WriteLogSafe(parsed.Message);
            // foreach (var uninterpretedOption in PingRequest.Descriptor.GetOptions().UninterpretedOption)
            // {
            //     TcpServer.WriteLogSafe(uninterpretedOption.Name);
            // }
        }
    }
}