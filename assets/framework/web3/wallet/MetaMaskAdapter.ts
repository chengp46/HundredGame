import { IWallet } from "./IWallet";

export class MetaMaskWallet implements IWallet {

    private address: string | null = null;

    private get eth() {
        return (window as any).ethereum;
    }

    async connect(): Promise<string> {

        if (!this.eth)
            throw new Error("MetaMask not found");

        const accounts = await this.eth.request({
            method: "eth_requestAccounts"
        });

        this.address = accounts[0];
        return this.address;
    }

    async sign(msg: string): Promise<string> {
        return await this.eth.request({
            method: "personal_sign",
            params: [msg, this.address]
        });
    }

    getAddress() {
        return this.address;
    }

    async disconnect() {}
}