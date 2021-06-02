﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace UnityExplorer.Web
{
    public class RequestHandlers
    {
        public static Dictionary<Type, List<WebSignalProperties>>
            SignalHandlers = new Dictionary<Type, List<WebSignalProperties>>();
        
        public static void Init()
        {
            var asm = Assembly.GetAssembly(typeof(Web.Test));
            foreach (var type in GetTypesWithHelpAttribute(asm))
            {
                var customAttrs = type.GetCustomAttributes(typeof(WebSignalAttribute), false);
                if (customAttrs.Length != 1)
                    continue;

                var customAttr = (WebSignalAttribute)customAttrs[0];

                if (!SignalHandlers.ContainsKey(customAttr.Signal))
                    SignalHandlers[customAttr.Signal] = new List<WebSignalProperties>();

                bool isValidReturn = ProtocolMap.VerifySignal(type.ReturnType);
                
                var mParams = type.GetParameters();

                bool useClient = false;
                bool useData = false;

                if (mParams.Length == 2)
                {
                    if (mParams[0].ParameterType != typeof(WebClient) || mParams[1].ParameterType != customAttr.Signal)
                        throw new Exception($"{type.DeclaringType.FullName} : {type} : Invalid Parameters");
                }
                else 
                    foreach (var parameterInfo in mParams)
                    {
                        if (parameterInfo.ParameterType == typeof(WebClient))
                            useClient = true;

                        if (mParams[1].ParameterType == customAttr.Signal)
                            useData = true;
                    }
                
                SignalHandlers[customAttr.Signal].Add(new WebSignalProperties
                {
                    RequestData = customAttr.Signal,
                    ResponseData = isValidReturn ? type.ReturnType : null,
                    Target = type,
                    CanUseResponse = isValidReturn,
                    UseClient = useClient,
                    UseData = useData
                }); 
            }
        }
        
        static IEnumerable<MethodInfo> GetTypesWithHelpAttribute(Assembly assembly) {
            foreach(Type type in assembly.GetTypes()) {
                if (!type.IsClass)
                    continue;

                foreach (var mType in type.GetMethods(BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public))
                {
                    if (mType.GetCustomAttributes(typeof(WebSignalAttribute), false).Length > 0) {
                        yield return mType;
                    }
                }
            }
        }
    }
}