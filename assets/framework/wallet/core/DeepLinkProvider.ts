import { IWalletProvider } from "./IWalletProvider";
import { SignUtil } from "./SignUtil";
import { WalletConfig } from "./WalletConfig";


export class DeepLinkProvider implements IWalletProvider {

    private address = "";

    async connect(): Promise<string> {
        const cb = this.buildCallback({
            action: "connect"
        });

        localStorage.setItem("WALLET_PENDING", "connect");
        window.location.href = WalletConfig.DEEPLINKS.okx(cb);
        return "WAITING_DEEPLINK";
    }

    async getAddress(): Promise<string> {
        if (this.address) return this.address;
        const params = new URLSearchParams(location.search);
        const addr = params.get("address");
        if (addr) {
            this.address = addr;
            localStorage.setItem("WALLET_ADDRESS", addr);
            this.clearQuery();
            return addr;
        }

        return localStorage.getItem("WALLET_ADDRESS") || "";
    }

    /*  DeepLink 签名 */
    async signMessage(message: string): Promise<string> {
        const hex = SignUtil.toHex(message);
        localStorage.setItem("WALLET_PENDING", "sign");

        const callback = this.buildCallback({
            action: "sign",
            method: "personal_sign",
            message: hex
        });

        window.location.href = WalletConfig.DEEPLINKS.metamask(callback);
        return "WAITING_SIGNATURE";
    }

    async sendTransaction(tx: any): Promise<any> {
      localStorage.setItem("WALLET_PENDING", "tx");
        const callback = this.buildCallback({
            action: "tx",
            tx: JSON.stringify(tx)
        });

        window.location.href = WalletConfig.DEEPLINKS.metamask(callback);
        return "WAITING_TX";
    }

    async restoreSession(): Promise<any> {
        const params = new URLSearchParams(location.search);
        const action = params.get("action");
        if (!action) return null;

        if (action === "sign") {
            const sig = params.get("signature");
            this.clearQuery();
            return { type: "sign", signature: sig };
        }

        if (action === "connect") {
            const addr = params.get("address");
            this.clearQuery();
            return { type: "connect", address: addr };
        }

        if (action === "tx") {
            const hash = params.get("txHash");
            this.clearQuery();
            return { type: "tx", txHash: hash };
        }
        return null;
    }

    private buildCallback(data: any) {
        const base = window.location.origin + window.location.pathname;
        const query = new URLSearchParams(data).toString();
        return encodeURIComponent(`${base}?${query}`);
    }

    private clearQuery() {
        history.replaceState({}, "", location.pathname);
    }
}