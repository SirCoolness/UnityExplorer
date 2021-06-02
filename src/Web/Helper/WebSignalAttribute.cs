using System;

namespace UnityExplorer.Web
{
    [AttributeUsage(AttributeTargets.Method)]
    public class WebSignalAttribute : Attribute
    {
        public Type Signal { get; private set; }
        public bool HandleInMain { get; private set; }
        
        public WebSignalAttribute(Type signal, bool handleInMain = false)
        {
            if (!ProtocolMap.VerifySignal(signal))
                throw new Exception($"{signal.FullName} is an invalid Signal");

            Signal = signal;
            HandleInMain = handleInMain;
        }
    }
}