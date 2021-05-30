using System.Net.Sockets;
using System.Net;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MelonLoader;

namespace UnityExplorer.Web
{
    internal class TcpServer
    {
        internal static Mutex IOManager = new Mutex();
        
        private bool Running = false;
        private TcpListener server;

        private Thread Thread;

        internal static Mutex LogIO = new Mutex();
        public static Queue<object> Logs = new Queue<object>();

        internal static Mutex ClientIO = new Mutex(); 
        private List<TcpClientHandle> Clients = new List<TcpClientHandle>();

        public void Start()
        {
            if (Running)
                return;

            Running = true;

            Thread = new Thread(new ThreadStart(StartThread));
            Thread.Name = "TcpServer";
            Thread.Start();
        }

        private void StartThread()
        {
            server = new TcpListener(IPAddress.Parse("127.0.0.1"), 6126);
            server.Start();

            ClientAcceptor();
        }

        private void ClientAcceptor()
        {
            while (true)
            {
                WriteLogSafe("Waiting for a connection... ");

                // Perform a blocking call to accept requests.
                // You could also use server.AcceptSocket() here.
                TcpClient client = server.AcceptTcpClient();
                ClientConnected(client);
            }
        }

        private void ClientConnected(TcpClient client)
        {
            var handle = new TcpClientHandle(client, ClientDisconnected);

            ClientIO.WaitOne();
            Clients.Add(handle);
            ClientIO.ReleaseMutex();
            
            handle.Start();
            
            WriteLogSafe("Connected!");
        }

        internal void ClientDisconnected(TcpClientHandle client)
        {
            ClientIO.WaitOne();
            Clients.Remove(client);
            ClientIO.ReleaseMutex();
        }

        internal static void WriteLogSafe(object message)
        {
            LogIO.WaitOne();
            Logs.Enqueue(message);
            LogIO.ReleaseMutex();
        }
    }
}