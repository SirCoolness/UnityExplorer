using System.Net.Sockets;
using System.Net;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MelonLoader;

namespace UnityExplorer.Web
{
    public class TcpServer
    {
        internal static Mutex IOManager = new Mutex();
        
        private bool Running = false;
        private TcpListener server;

        private Thread Thread;

        internal static Mutex LogIO = new Mutex();
        internal static Queue<object> Logs = new Queue<object>();

        internal static Mutex ClientIO = new Mutex(); 
        public readonly List<WebClient> Clients = new List<WebClient>();
        
        public event EventHandler<WebClient> ClientConnected;
        public event EventHandler<WebClient> ClientDisconnected;

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
                OnClientConnected(client);
            }
        }

        private void OnClientConnected(TcpClient session)
        {
            var client = new WebClient(session);

            ClientIO.WaitOne();
            Clients.Add(client);
            ClientIO.ReleaseMutex();

            client.Disconnected += OnClientDisconnected;
            
            WriteLogSafe($"{client.Session.Id} | Connected!");
            ClientConnected?.Invoke(this, client);
            
            client.Start();
        }

        private void OnClientDisconnected(object sender, WebClient client)
        {
            WriteLogSafe($"{client.Session.Id} | Disconnected!");
            
            ClientDisconnected?.Invoke(this, client);
            
            ClientIO.WaitOne();
            Clients.Remove(client);
            ClientIO.ReleaseMutex();

            client.Dispose();
        }

        internal static void WriteLogSafe(object message)
        {
            LogIO.WaitOne();
            Logs.Enqueue(message);
            LogIO.ReleaseMutex();
        }
    }
}