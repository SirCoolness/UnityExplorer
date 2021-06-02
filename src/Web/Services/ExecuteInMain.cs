using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;

namespace UnityExplorer.Web
{
    public class ExecuteInMain
    {
        private static Mutex QueueIO = new Mutex();
        private static Queue<Action> ActionsQueue = new Queue<Action>();

        internal static void Init()
        {
#if ML
            MelonLoader.MelonCoroutines.Start(Update());
#else
            ExplorerCore.LogError("Execute in main not supported yet.");
            return;
#endif
        }
        
        public static void ExecuteNextFrame(Action callback)
        {
            QueueIO.WaitOne();
            ActionsQueue.Enqueue(callback);
            QueueIO.ReleaseMutex();
        }

        public static void HandleError(Action callback)
        {
            try
            {
                callback();
            }
            catch (Exception e)
            {
                QueueIO.WaitOne();
                ActionsQueue.Enqueue(callback);
                QueueIO.ReleaseMutex();
            }
        }
        
        private static IEnumerator Update()
        {
            while (true)
            {
                QueueIO.WaitOne();
                
                if (ActionsQueue.Count > 0)
                {
                    var actionsQueue = ActionsQueue.ToArray();
                    foreach (var act in actionsQueue)
                        act();
                    ActionsQueue.Clear();
                }
                
                QueueIO.ReleaseMutex();
                yield return null;
            }
        }
    }
}