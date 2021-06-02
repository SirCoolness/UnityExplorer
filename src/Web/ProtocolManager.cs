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

        private static void DecodeMessage(WebClient client, byte[] message)
        {
            int commandId = BitConverter.ToInt32(message, 0);
            bool useTracker = BitConverter.ToBoolean(message, 4);
            TrackerOrigin origin = useTracker && BitConverter.ToBoolean(message, 5) ? TrackerOrigin.Client : TrackerOrigin.Server;
            int tracker = useTracker ? BitConverter.ToInt32(message, 6) : 0;

            bool hasData = BitConverter.ToBoolean(message, useTracker ? 10 : 5);
            int headersLen = useTracker ? 11 : 6;

            if (!ProtocolMap.ProtocolCache.Forward.HasEntry(commandId))
            {
                TcpServer.WriteLogSafe($"{client.Session.Id} | WARNING: client sent invalid command. ignoring.");
                return;
            }

            TcpServer.WriteLogSafe($"{client.Session.Id} | Recieved [{BitConverter.ToString(message)}]");
            
            var command = hasData ? SignalReceived.BuildSignal(commandId, ref message, headersLen) : null;
            SignalReceived.OnSignalReceived(client, command, useTracker, tracker, origin);

            // if (origin != TrackerOrigin.Client)
            //     return;
            //
            // if (command == typeof(PingRequest))
            // {
            //     WriteMessage(session, new PingResponse
            //     {
            //         Message = session.Id
            //     }, tracker, origin);
            //
            //     WriteMessage(session, new PingRequest
            //     {
            //         Message = session.Id
            //     }, 0, TrackerOrigin.Server);
            // } else if (command == typeof(PingResponse))
            // {
            //     TcpServer.WriteLogSafe(headersLen);
            //     TcpServer.WriteLogSafe($"{session.Id} | PONG [{PingResponse.Parser.ParseFrom(message, headersLen, message.Length - headersLen)}]");
            // }
        }

        public static void Listen(TcpServer server)
        {
            server.ClientConnected += (_, client) => OnConnected(client);
        }

        private static void OnConnected(WebClient client)
        {
            client.Session.BinaryMessageReceived += (_, message) => ExecuteInMain.HandleError(() => DecodeMessage(client, message));
        }

        public static void WriteMessage(WebClient client, IMessage data, Int32 tracker, TrackerOrigin origin)
            => WriteMessage(client, data, tracker, origin, true);
        
        public static void WriteMessage(WebClient client, IMessage data, [Optional] Int32 tracker, [Optional] TrackerOrigin origin, bool useTracker = false)
        {
            var type = data.GetType();
            if (!ProtocolMap.ProtocolCache.Reverse.HasEntry(type))
            {
                TcpServer.WriteLogSafe($"{client.Session.Id} | WARNING: attempted to send invalid command. ignoring.");
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

            var res = streamRaw.ToArray();
            TcpServer.WriteLogSafe($"{client.Session.Id} | Sending: {BitConverter.ToString(res)}");
            client.Session.QueueMessage(res, true);
            streamRaw.Dispose();
        }
    }
}