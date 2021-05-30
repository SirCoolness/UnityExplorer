using System;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using MelonLoader;

namespace UnityExplorer.Web
{
    public class TcpClientHandle
    {
        private bool Running = false;
        private TcpClient client;
        private Action<TcpClientHandle> DisconnectHandle;

        private Thread Thread;
        
        public TcpClientHandle(TcpClient client, Action<TcpClientHandle> OnDisconnect)
        {
            this.client = client;
            DisconnectHandle = OnDisconnect;
            
            Thread = new Thread(new ThreadStart(Reader));
            Thread.Name = "TcpClient Reader";
        }

        public void Start()
        {
            if (Running)
                return;
            Running = true;
            
            Thread.Start();
            TcpServer.WriteLogSafe("Client started");
        }

        // copy and paste from msdn
        // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server
        private void Reader()
        {
            var stream = client.GetStream();

            while (client.Connected)
            {
                while (!stream.DataAvailable);
                while (client.Available < 3); // match against "get"
                
                byte[] bytes = new byte[client.Available];
                stream.Read(bytes, 0, client.Available);
                string s = Encoding.UTF8.GetString(bytes);
                
                if (Regex.IsMatch(s, "^GET", RegexOptions.IgnoreCase))
                {
                    TcpServer.WriteLogSafe($"=====Handshaking from client=====\n{s}");
                    
                    string swk = Regex.Match(s, "Sec-WebSocket-Key: (.*)").Groups[1].Value.Trim();
                    string swka = swk + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                    byte[] swkaSha1 = System.Security.Cryptography.SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(swka));
                    string swkaSha1Base64 = Convert.ToBase64String(swkaSha1);

                    byte[] response = Encoding.UTF8.GetBytes(
                        "HTTP/1.1 101 Switching Protocols\r\n" +
                        "Connection: Upgrade\r\n" +
                        "Upgrade: websocket\r\n" +
                        "Sec-WebSocket-Accept: " + swkaSha1Base64 + "\r\n\r\n");

                    stream.Write(response, 0, response.Length);
                }
                else
                {
                    bool fin = (bytes[0] & 0b10000000) != 0,
                        mask = (bytes[1] & 0b10000000) != 0; // must be true, "All messages from the client to the server have this bit set"

                    int opcode = bytes[0] & 0b00001111, // expecting 1 - text message
                        msglen = bytes[1] - 128, // & 0111 1111
                        offset = 2;

                    if (msglen == 126) {
                        // was ToUInt16(bytes, offset) but the result is incorrect
                        msglen = BitConverter.ToUInt16(new byte[] { bytes[3], bytes[2] }, 0);
                        offset = 4;
                    } else if (msglen == 127) {
                        TcpServer.WriteLogSafe("TODO: msglen == 127, needs qword to store msglen");
                        // i don't really know the byte order, please edit this
                        // msglen = BitConverter.ToUInt64(new byte[] { bytes[5], bytes[4], bytes[3], bytes[2], bytes[9], bytes[8], bytes[7], bytes[6] }, 0);
                        // offset = 10;
                    }

                    if (msglen == 0)
                        TcpServer.WriteLogSafe("msglen == 0");
                    else if (mask) {
                        byte[] decoded = new byte[msglen];
                        byte[] masks = new byte[4] { bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3] };
                        offset += 4;

                        for (int i = 0; i < msglen; ++i)
                            decoded[i] = (byte)(bytes[offset + i] ^ masks[i % 4]);

                        string text = Encoding.UTF8.GetString(decoded);
                        TcpServer.WriteLogSafe(text);
                    } else
                        TcpServer.WriteLogSafe("mask bit not set");
                }
            }
            
            Disconnect();
        }

        public void Disconnect()
        {
            DisconnectHandle(this);
        }
    }
}