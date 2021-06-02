namespace UnityExplorer.Web
{
    public class Test
    {
        [WebSignal(typeof(PingRequest))]
        private static void OnSignal()
        {
            
        }
    }
}