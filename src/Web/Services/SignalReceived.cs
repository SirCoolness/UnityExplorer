using System;
using System.Runtime.InteropServices;
using Google.Protobuf;

namespace UnityExplorer.Web
{
    public class SignalReceived
    {
        public static void OnSignalReceived(
            WebClient client, 
            object buff, 
            bool useTracker, 
            Int32 tracker,
            ProtocolManager.TrackerOrigin origin
        )
        {
            var proto = buff.GetType();

            if (useTracker)
                switch (origin)
                {
                    case ProtocolManager.TrackerOrigin.Client:
                        HandleClientMutation(client, proto, buff, tracker);
                        break;
                    case ProtocolManager.TrackerOrigin.Server:
                        HandleMutationResponse(client, proto, buff, tracker);
                        break;
                }
            
            HandleSignal(client, proto, buff);
        }

        private static object[] GetArgs(WebClient client, object buff, WebSignalProperties properties)
        {
            var len = Convert.ToInt32(properties.UseClient) + Convert.ToInt32(properties.UseData);
            var args = new object[len];
            
            if (properties.UseClient)
                args[0] = client;

            if (properties.UseData)
                args[len - 1] = buff;

            return args;
        }
        
        private static void HandleClientMutation(WebClient client, Type type, object buff, int tracker)
        {
            if (!SignalMap.MutationHandlers.ContainsKey(type))
                // Handle unused mutation
                return;

            var properties = SignalMap.MutationHandlers[type];
            var args = GetArgs(client, buff, properties);

            Action complete = () =>
            {
                var response = properties.Target.Invoke(null, args);
                CompleteClientMutation(client, response, tracker);
            };
            
            if (properties.HandleInMain)
                ExecuteInMain.ExecuteNextFrame(complete);
            else
                complete.Invoke();
        }

        private static void CompleteClientMutation(WebClient client, object resBuff, int tracker)
        {
            ProtocolManager.WriteMessage(client, (IMessage)resBuff, tracker, ProtocolManager.TrackerOrigin.Client, true);
        }

        private static void HandleMutationResponse(WebClient client, Type type, object buff, int tracker)
        {
            
        }

        private static void HandleSignal(WebClient client, Type type, object buff)
        {
            if (!SignalMap.SignalHandlers.ContainsKey(type))
                return;

            var signalListeners = SignalMap.SignalHandlers[type];
            
            foreach (var properties in signalListeners)
            {
                var args = GetArgs(client, buff, properties);
                properties.Target.Invoke(null, args);
            }
        }

        internal static object BuildSignal(int commandId, ref byte[] buff, int offset)
        {
            var command = ProtocolMap.ProtocolAttributes[ProtocolMap.ProtocolCache.Forward[commandId]];
            return command.Parser.ParseFrom(buff, offset, buff.Length - offset);
        }
    }
}