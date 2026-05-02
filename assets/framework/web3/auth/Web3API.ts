export class Web3API {

    static async getNonce(addr: string) {
        const r = await fetch("/api/web3/nonce", {
            method: "POST",
            body: JSON.stringify({ addr })
        });

        return (await r.json()).nonce;
    }

    static async login(addr: string, sig: string) {
        const r = await fetch("/api/web3/login", {
            method: "POST",
            body: JSON.stringify({ addr, sig })
        });

        return r.json();
    }
}