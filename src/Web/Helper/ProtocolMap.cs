using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Google.Protobuf;
using Google.Protobuf.Reflection;
using MelonLoader;

namespace UnityExplorer.Web
{
    public static class ProtocolMap
    {
        private static List<Type> ProtocolKlasses = new List<Type>();
        internal static Map<int, Type> ProtocolCache = new Map<int, Type>();

        internal static Dictionary<Type, ProtocolAttributes> ProtocolAttributes =
            new Dictionary<Type, ProtocolAttributes>();
        
        static ProtocolMap()
        {
            ProtocolKlasses = Assembly.GetAssembly(typeof(IMessage)).GetTypes().Where(type =>
                {
                    if (!type.GetInterfaces().Any(i =>
                        i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IMessage<>)))
                        return false;

                    var descriptor = GetDescriptor(type);
                    if (descriptor == null)
                        return false;

                    var options = descriptor.GetOptions();
                    if ((options) == null)
                        return false;
                    
                    return options.HasExtension(CommandExtensions.DataId);
                }
            ).ToList();

            foreach (var protocolKlass in ProtocolKlasses)
            {
                var descriptor = GetDescriptor(protocolKlass);
                var ID = descriptor.GetOptions().GetExtension(CommandExtensions.DataId);
                if (ProtocolCache.Forward.HasEntry(ID))
                {
                    ExplorerCore.LogError($"{protocolKlass.FullName} (data_id) is a duplicate of {ProtocolCache.Forward[ID].FullName}. skipping");
                    continue;
                }
                ProtocolCache.Add(ID, protocolKlass);
                AddProtocolMessage(protocolKlass);
            }
        }

        private static MessageDescriptor GetDescriptor(Type type)
        {
            var f = type.GetProperty("Descriptor", BindingFlags.Public | BindingFlags.Static);
            if (f == null)
                return null;

            var getter = f.GetGetMethod();
            if (getter == null)
                return null;

            return (MessageDescriptor) getter.Invoke(null, null);
        }

        private static MessageParser GetParser(Type type)
        {
            var f = type.GetProperty("Parser", BindingFlags.Public | BindingFlags.Static);
            if (f == null)
                return null;

            var getter = f.GetGetMethod();
            if (getter == null)
                return null;

            return (MessageParser) getter.Invoke(null, null);
        }

        private static void AddProtocolMessage(Type type)
        {
            var descriptor = GetDescriptor(type);
            var parser = GetParser(type);
            
            if (descriptor.IsNullOrDestroyed() || parser.IsNullOrDestroyed())
                return;
            
            ProtocolAttributes.Add(type, new ProtocolAttributes
            {
                Descriptor = descriptor,
                Parser = parser,
                HasData = descriptor.Fields.InDeclarationOrder().Count > 0
            });
        }
        
        public static bool VerifySignal(Type signal)
        {
            return ProtocolCache.Reverse.HasEntry(signal);
        }
    }

    public class ProtocolAttributes
    {
        public MessageParser Parser { get; internal set; }
        public MessageDescriptor Descriptor { get; internal set; }
        public bool HasData { get; internal set; }
    }
}