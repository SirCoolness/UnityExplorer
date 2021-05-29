import * as $protobuf from "protobufjs";
/** Properties of a PingRequest. */
export interface IPingRequest {

    /** PingRequest message */
    message?: (string|null);
}

/** Represents a PingRequest. */
export class PingRequest implements IPingRequest {

    /**
     * Constructs a new PingRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPingRequest);

    /** PingRequest message. */
    public message: string;

    /**
     * Creates a new PingRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PingRequest instance
     */
    public static create(properties?: IPingRequest): PingRequest;

    /**
     * Encodes the specified PingRequest message. Does not implicitly {@link PingRequest.verify|verify} messages.
     * @param message PingRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPingRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PingRequest message, length delimited. Does not implicitly {@link PingRequest.verify|verify} messages.
     * @param message PingRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPingRequest, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PingRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PingRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PingRequest;

    /**
     * Decodes a PingRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PingRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PingRequest;

    /**
     * Verifies a PingRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PingRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PingRequest
     */
    public static fromObject(object: { [k: string]: any }): PingRequest;

    /**
     * Creates a plain object from a PingRequest message. Also converts values to other types if specified.
     * @param message PingRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PingRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PingRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PingResponse. */
export interface IPingResponse {

    /** PingResponse message */
    message?: (string|null);
}

/** Represents a PingResponse. */
export class PingResponse implements IPingResponse {

    /**
     * Constructs a new PingResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPingResponse);

    /** PingResponse message. */
    public message: string;

    /**
     * Creates a new PingResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PingResponse instance
     */
    public static create(properties?: IPingResponse): PingResponse;

    /**
     * Encodes the specified PingResponse message. Does not implicitly {@link PingResponse.verify|verify} messages.
     * @param message PingResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPingResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PingResponse message, length delimited. Does not implicitly {@link PingResponse.verify|verify} messages.
     * @param message PingResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPingResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PingResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PingResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PingResponse;

    /**
     * Decodes a PingResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PingResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PingResponse;

    /**
     * Verifies a PingResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PingResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PingResponse
     */
    public static fromObject(object: { [k: string]: any }): PingResponse;

    /**
     * Creates a plain object from a PingResponse message. Also converts values to other types if specified.
     * @param message PingResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PingResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PingResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
