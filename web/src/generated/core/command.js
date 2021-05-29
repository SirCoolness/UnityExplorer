// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.CommandRequest = (function() {

    /**
     * Properties of a CommandRequest.
     * @exports ICommandRequest
     * @interface ICommandRequest
     * @property {number|null} [tracker] CommandRequest tracker
     * @property {number|null} [dataId] CommandRequest dataId
     * @property {Uint8Array|null} [data] CommandRequest data
     */

    /**
     * Constructs a new CommandRequest.
     * @exports CommandRequest
     * @classdesc Represents a CommandRequest.
     * @implements ICommandRequest
     * @constructor
     * @param {ICommandRequest=} [properties] Properties to set
     */
    function CommandRequest(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommandRequest tracker.
     * @member {number} tracker
     * @memberof CommandRequest
     * @instance
     */
    CommandRequest.prototype.tracker = 0;

    /**
     * CommandRequest dataId.
     * @member {number} dataId
     * @memberof CommandRequest
     * @instance
     */
    CommandRequest.prototype.dataId = 0;

    /**
     * CommandRequest data.
     * @member {Uint8Array|null|undefined} data
     * @memberof CommandRequest
     * @instance
     */
    CommandRequest.prototype.data = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * CommandRequest _data.
     * @member {"data"|undefined} _data
     * @memberof CommandRequest
     * @instance
     */
    Object.defineProperty(CommandRequest.prototype, "_data", {
        get: $util.oneOfGetter($oneOfFields = ["data"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new CommandRequest instance using the specified properties.
     * @function create
     * @memberof CommandRequest
     * @static
     * @param {ICommandRequest=} [properties] Properties to set
     * @returns {CommandRequest} CommandRequest instance
     */
    CommandRequest.create = function create(properties) {
        return new CommandRequest(properties);
    };

    /**
     * Encodes the specified CommandRequest message. Does not implicitly {@link CommandRequest.verify|verify} messages.
     * @function encode
     * @memberof CommandRequest
     * @static
     * @param {ICommandRequest} message CommandRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommandRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.tracker != null && Object.hasOwnProperty.call(message, "tracker"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.tracker);
        if (message.dataId != null && Object.hasOwnProperty.call(message, "dataId"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.dataId);
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified CommandRequest message, length delimited. Does not implicitly {@link CommandRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommandRequest
     * @static
     * @param {ICommandRequest} message CommandRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommandRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommandRequest message from the specified reader or buffer.
     * @function decode
     * @memberof CommandRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommandRequest} CommandRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommandRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommandRequest();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.tracker = reader.int32();
                break;
            case 2:
                message.dataId = reader.int32();
                break;
            case 3:
                message.data = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommandRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommandRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommandRequest} CommandRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommandRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommandRequest message.
     * @function verify
     * @memberof CommandRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommandRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.tracker != null && message.hasOwnProperty("tracker"))
            if (!$util.isInteger(message.tracker))
                return "tracker: integer expected";
        if (message.dataId != null && message.hasOwnProperty("dataId"))
            if (!$util.isInteger(message.dataId))
                return "dataId: integer expected";
        if (message.data != null && message.hasOwnProperty("data")) {
            properties._data = 1;
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        }
        return null;
    };

    /**
     * Creates a CommandRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommandRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommandRequest} CommandRequest
     */
    CommandRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.CommandRequest)
            return object;
        var message = new $root.CommandRequest();
        if (object.tracker != null)
            message.tracker = object.tracker | 0;
        if (object.dataId != null)
            message.dataId = object.dataId | 0;
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a CommandRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommandRequest
     * @static
     * @param {CommandRequest} message CommandRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommandRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.tracker = 0;
            object.dataId = 0;
        }
        if (message.tracker != null && message.hasOwnProperty("tracker"))
            object.tracker = message.tracker;
        if (message.dataId != null && message.hasOwnProperty("dataId"))
            object.dataId = message.dataId;
        if (message.data != null && message.hasOwnProperty("data")) {
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            if (options.oneofs)
                object._data = "data";
        }
        return object;
    };

    /**
     * Converts this CommandRequest to JSON.
     * @function toJSON
     * @memberof CommandRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommandRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CommandRequest;
})();

$root.CommandResponse = (function() {

    /**
     * Properties of a CommandResponse.
     * @exports ICommandResponse
     * @interface ICommandResponse
     * @property {number|null} [tracker] CommandResponse tracker
     * @property {Uint8Array|null} [data] CommandResponse data
     */

    /**
     * Constructs a new CommandResponse.
     * @exports CommandResponse
     * @classdesc Represents a CommandResponse.
     * @implements ICommandResponse
     * @constructor
     * @param {ICommandResponse=} [properties] Properties to set
     */
    function CommandResponse(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommandResponse tracker.
     * @member {number} tracker
     * @memberof CommandResponse
     * @instance
     */
    CommandResponse.prototype.tracker = 0;

    /**
     * CommandResponse data.
     * @member {Uint8Array|null|undefined} data
     * @memberof CommandResponse
     * @instance
     */
    CommandResponse.prototype.data = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * CommandResponse _data.
     * @member {"data"|undefined} _data
     * @memberof CommandResponse
     * @instance
     */
    Object.defineProperty(CommandResponse.prototype, "_data", {
        get: $util.oneOfGetter($oneOfFields = ["data"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new CommandResponse instance using the specified properties.
     * @function create
     * @memberof CommandResponse
     * @static
     * @param {ICommandResponse=} [properties] Properties to set
     * @returns {CommandResponse} CommandResponse instance
     */
    CommandResponse.create = function create(properties) {
        return new CommandResponse(properties);
    };

    /**
     * Encodes the specified CommandResponse message. Does not implicitly {@link CommandResponse.verify|verify} messages.
     * @function encode
     * @memberof CommandResponse
     * @static
     * @param {ICommandResponse} message CommandResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommandResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.tracker != null && Object.hasOwnProperty.call(message, "tracker"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.tracker);
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified CommandResponse message, length delimited. Does not implicitly {@link CommandResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommandResponse
     * @static
     * @param {ICommandResponse} message CommandResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommandResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommandResponse message from the specified reader or buffer.
     * @function decode
     * @memberof CommandResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommandResponse} CommandResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommandResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommandResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.tracker = reader.int32();
                break;
            case 2:
                message.data = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommandResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommandResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommandResponse} CommandResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommandResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommandResponse message.
     * @function verify
     * @memberof CommandResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommandResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.tracker != null && message.hasOwnProperty("tracker"))
            if (!$util.isInteger(message.tracker))
                return "tracker: integer expected";
        if (message.data != null && message.hasOwnProperty("data")) {
            properties._data = 1;
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        }
        return null;
    };

    /**
     * Creates a CommandResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommandResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommandResponse} CommandResponse
     */
    CommandResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.CommandResponse)
            return object;
        var message = new $root.CommandResponse();
        if (object.tracker != null)
            message.tracker = object.tracker | 0;
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a CommandResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommandResponse
     * @static
     * @param {CommandResponse} message CommandResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommandResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.tracker = 0;
        if (message.tracker != null && message.hasOwnProperty("tracker"))
            object.tracker = message.tracker;
        if (message.data != null && message.hasOwnProperty("data")) {
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            if (options.oneofs)
                object._data = "data";
        }
        return object;
    };

    /**
     * Converts this CommandResponse to JSON.
     * @function toJSON
     * @memberof CommandResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommandResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CommandResponse;
})();