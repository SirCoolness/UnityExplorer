using System;
using System.Reflection;
using System.Runtime.InteropServices;

namespace UnityExplorer.Web
{
    public struct WebSignalProperties
    {
        public Type RequestData;
        public Type ResponseData;
        public MethodInfo Target;

        public bool UseClient;
        public bool UseData;
        public bool CanUseResponse;
    }
}