using System.Collections.Generic;
using System.Linq;
using Google.Protobuf.Collections;
using UnityExplorer.UI.ObjectExplorer;

namespace UnityExplorer.Web
{
    public class Test
    {
        private static SceneResponse sceneResponse = new SceneResponse();
        
        [WebSignal(typeof(PingRequest))]
        private static PingResponse Pong(WebClient client, PingRequest ping)
        {
            return new PingResponse
            {
                Message = $"Session [{client.Session.Id}] | Message [{ping.Message}]"
            };
        }

        [WebSignal(typeof(SceneRequest), true)]
        private static SceneResponse GetScene()
        {
            TcpServer.WriteLogSafe("Get Scene");
            sceneResponse.Gameobjects.Clear();
            sceneResponse.Gameobjects.AddRange(SceneHandler.CurrentRootObjects.Select(item => new WebGameObject
            {
                Reference = 0,
                Enabled = item.active,
                Name = item.name
            }));

            return sceneResponse;
        }
    }
}