import { IWalletProvider } from "../types";
import { WalletDetect } from "./WalletDetect";

export class InjectedProvider implements IWalletProvider {

    private provider: any;
    private address = "";

    constructor() {
        this.provider = WalletDetect.getProvider();
    }

    async connect(): Promise<string> {
        if (!this.provider)
            throw "NO_INJECTED_WALLET";

        const accounts = await this.provider.request({
            method: "eth_requestAccounts"
        });

        this.address = accounts[0];
        localStorage.setItem("WALLET_ADDRESS", this.address);
        return this.address;
    }

    async getAddress(): Promise<string> {
        if (this.address) return this.address;
        const acc = await this.provider.request({
            method: "eth_accounts"
        });
        this.address = acc[0] || "";
        return this.address;
    }

    async sendTransaction(tx: any): Promise<any> {
        return await this.provider.request({
            method: "eth_sendTransaction",
            params: [tx]
        });
    }

    async signMessage(msg: string) {
        return await this.provider.request({
            method: "personal_sign",
            params: [msg, this.address]
        });
    }
}