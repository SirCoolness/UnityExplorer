namespace UnityExplorer.Web
{
    public class Test
    {
        [WebSignal(typeof(PingRequest))]
        private static PingResponse Pong(WebClient client, PingRequest ping)
        {
            return new PingResponse
            {
                Message = $"Session [{client.Session.Id}] | Message [{ping.Message}]"
            };
        }
    }
}