using System;
using System.Collections;

namespace UnityExplorer.Web
{
    public class TcpServerIO
    {
        public static TcpServer Server = new TcpServer();
        private static bool Running = false;

        public static void Start()
        {
            if (Running)
                throw new Exception("Already Running");
            Running = true;
            
            ProtocolManager.Listen(Server);
            
#if ML
            MelonLoader.MelonCoroutines.Start(Reader());
#else
            ExplorerCore.LogError("TCP Web Server not supported yet.");
            return;
#endif
            
            Server.Start();
            ExplorerCore.Log("Server Started");
        }
        
        private static IEnumerator Reader()
        {
            ExplorerCore.Log("Reader started");
            while (true)
            {
                TcpServer.LogIO.WaitOne();

                if (TcpServer.Logs.Count > 0)
                {
                    var logs = TcpServer.Logs.ToArray();
                    foreach (var log in logs)
                    {
                        ExplorerCore.Log(log);
                    }
                    TcpServer.Logs.Clear();
                }
                
                TcpServer.LogIO.ReleaseMutex();

                yield return null;
            }
        }
    }
}