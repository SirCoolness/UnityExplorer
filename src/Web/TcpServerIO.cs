using System;
using System.Collections;

namespace UnityExplorer.Web
{
    public class TcpServerIO
    {
        private static bool Running = false;
        private static TcpServer Server = new TcpServer();

        public static void Start()
        {
            if (Running)
                throw new Exception("Already Running");
            Running = true;
            
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