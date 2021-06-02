using System;
using System.Net.Sockets;
using Mono.CSharp;

namespace UnityExplorer.Web
{
    public class WebClient
    {
        private bool IsRunning = false;
        
        public WebSocketSession Session { get; internal set; }
        public event EventHandler<WebClient> Disconnected;
        
        public WebClient(TcpClient session)
        {
            Session = new WebSocketSession(session);
            
            Session.Disconnected += OnDisconnect;
        }

        public void Start()
        {
            if (IsRunning)
                return;
            
            Session.Start();
        }

        public void Dispose()
        {
            if (!IsRunning)
                return;
            
            Session.Dispose();
        }

        private void OnDisconnect(object sender, WebSocketSession session)
        {
            Disconnected?.Invoke(sender, this);
        }
    }
}