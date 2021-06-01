export class Debug {
    public static I2Hex(i: number): string {
        return ('0' + i.toString(16)).slice(-2);
    }

    public static DebugBuff(buff: Uint8Array): string
    {
        return Array.from(buff).map(this.I2Hex).join(' ')
    }

    public static Log(buff: Uint8Array) {
        console.log(this.DebugBuff(buff));
    }
}
