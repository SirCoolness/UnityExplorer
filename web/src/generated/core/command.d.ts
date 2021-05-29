import * as $protobuf from "protobufjs";
/** Properties of a CommandRequest. */
export interface ICommandRequest {

    /** CommandRequest tracker */
    tracker?: (number|null);

    /** CommandRequest dataId */
    dataId?: (number|null);

    /** CommandRequest data */
    data?: (Uint8Array|null);
}

/** Represents a CommandRequest. */
export class CommandRequest implements ICommandRequest {

    /**
     * Constructs a new CommandRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICommandRequest);

    /** CommandRequest tracker. */
    public tracker: number;

    /** CommandRequest dataId. */
    public dataId: number;

    /** CommandRequest data. */
    public data?: (Uint8Array|null);

    /** CommandRequest _data. */
    public _data?: "data";

    /**
     * Creates a new CommandRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CommandRequest instance
     */
    public static create(properties?: ICommandRequest): CommandRequest;

    /**
     * Encodes the specified CommandRequest message. Does not implicitly {@link CommandRequest.verify|verify} messages.
     * @param message CommandRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICommandRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CommandRequest message, length delimited. Does not implicitly {@link CommandRequest.verify|verify} messages.
     * @param message CommandRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICommandRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CommandRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CommandRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CommandRequest;

    /**
     * Decodes a CommandRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CommandRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CommandRequest;

    /**
     * Verifies a CommandRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CommandRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CommandRequest
     */
    public static fromObject(object: { [k: string]: any }): CommandRequest;

    /**
     * Creates a plain object from a CommandRequest message. Also converts values to other types if specified.
     * @param message CommandRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CommandRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CommandRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CommandResponse. */
export interface ICommandResponse {

    /** CommandResponse tracker */
    tracker?: (number|null);

    /** CommandResponse data */
    data?: (Uint8Array|null);
}

/** Represents a CommandResponse. */
export class CommandResponse implements ICommandResponse {

    /**
     * Constructs a new CommandResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICommandResponse);

    /** CommandResponse tracker. */
    public tracker: number;

    /** CommandResponse data. */
    public data?: (Uint8Array|null);

    /** CommandResponse _data. */
    public _data?: "data";

    /**
     * Creates a new CommandResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CommandResponse instance
     */
    public static create(properties?: ICommandResponse): CommandResponse;

    /**
     * Encodes the specified CommandResponse message. Does not implicitly {@link CommandResponse.verify|verify} messages.
     * @param message CommandResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICommandResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CommandResponse message, length delimited. Does not implicitly {@link CommandResponse.verify|verify} messages.
     * @param message CommandResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICommandResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CommandResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CommandResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CommandResponse;

    /**
     * Decodes a CommandResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CommandResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CommandResponse;

    /**
     * Verifies a CommandResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CommandResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CommandResponse
     */
    public static fromObject(object: { [k: string]: any }): CommandResponse;

    /**
     * Creates a plain object from a CommandResponse message. Also converts values to other types if specified.
     * @param message CommandResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CommandResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CommandResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
