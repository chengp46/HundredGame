export class SignUtil {

    /* UTF8 → HEX */

    static toHex(message: string): string {

        const bytes = new TextEncoder().encode(message);

        return "0x" + Array
            .from(bytes)
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    /* GOD MODE SIGN */

    static async signInjected(message: string) {

        const ethereum = (window as any).ethereum;

        if (!ethereum)
            throw new Error("No injected wallet");

        const accounts = await ethereum.request({
            method: "eth_requestAccounts"
        });

        const address = accounts[0];

        const hex = this.toHex(message);

        const signature = await ethereum.request({
            method: "personal_sign",
            params: [hex, address]
        });

        return { address, signature };
    }
}