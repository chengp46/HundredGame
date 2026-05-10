import { WalletDetect } from "../core/WalletDetect";
import { IWalletProvider } from "./IWalletProvider";
import { SignUtil } from "./SignUtil";

export class InjectedProvider implements IWalletProvider {

    private provider: any;
    private address = "";

    constructor() {
        this.provider = WalletDetect.getInjected();
    }

    async connect(): Promise<string> {
        const accounts = await this.provider.request({
            method: "eth_requestAccounts"
        });

        this.address = accounts[0];
        return this.address;
    }

    async getAddress(): Promise<string> {
        return this.address;
    }

    /* 统一签名 */
    async signMessage(message: string): Promise<string> {
        const result = await SignUtil.signInjected(message);
        this.address = result.address;
        return result.signature;
    }

    async sendTransaction(tx: any): Promise<any> {
        return await this.provider.request({
            method: "eth_sendTransaction",
            params: [tx]
        });
    }
}