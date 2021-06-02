using System;

namespace UnityExplorer.Web
{
    [AttributeUsage(AttributeTargets.Method)]
    public class WebSignalAttribute : Attribute
    {
        internal Type Signal;
        
        public WebSignalAttribute(Type signal)
        {
            if (!ProtocolMap.VerifySignal(signal))
                throw new Exception($"{signal.FullName} is an invalid Signal");

            Signal = signal;
        }
    }
}