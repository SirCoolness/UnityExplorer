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
        public readonly List<WebSocketSession> Clients = new List<WebSocketSession>();
        
        public event EventHandler<WebSocketSession> ClientConnected;
        public event EventHandler<WebSocketSession> ClientDisconnected;

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

        private void OnClientConnected(TcpClient client)
        {
            var session = new WebSocketSession(client);

            ClientIO.WaitOne();
            Clients.Add(session);
            ClientIO.ReleaseMutex();

            session.Disconnected += OnClientDisconnected;
            
            WriteLogSafe($"{session.Id} | Connected!");
            ClientConnected?.Invoke(this, session);
            session.Start();
        }

        private void OnClientDisconnected(object sender, WebSocketSession session)
        {
            WriteLogSafe($"{session.Id} | Disconnected!");
            
            ClientDisconnected?.Invoke(this, session);
            
            ClientIO.WaitOne();
            Clients.Remove(session);
            ClientIO.ReleaseMutex();

            session.Dispose();
        }

        internal static void WriteLogSafe(object message)
        {
            LogIO.WaitOne();
            Logs.Enqueue(message);
            LogIO.ReleaseMutex();
        }
    }
}