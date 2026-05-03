import { IWalletProvider } from "../types";
import { WalletConfig } from "../WalletConfig";
import { WalletDetect } from "./WalletDetect";

export class DeepLinkProvider implements IWalletProvider {

    private address = "";

    async connect(): Promise<string> {

        const url = window.location.href.split("?")[0];

        const callback =
            encodeURIComponent(url + "?wallet_callback=1");

        const link = WalletDetect.isMobile()
            ? WalletConfig.DEEPLINKS.okx(callback)
            : WalletConfig.DEEPLINKS.metamask(callback);

        localStorage.setItem("WALLET_PENDING", "1");

        window.location.href = link;

        return "WAITING_CALLBACK";
    }

    async getAddress(): Promise<string> {

        const params = new URLSearchParams(location.search);

        const addr = params.get("address");

        if (addr) {
            this.address = addr;
            localStorage.setItem("WALLET_ADDRESS", addr);
            return addr;
        }

        const cache = localStorage.getItem("WALLET_ADDRESS");

        if (cache) {
            this.address = cache;
            return cache;
        }

        return "";
    }

    async sendTransaction(tx: any): Promise<any> {

        const encoded = encodeURIComponent(
            JSON.stringify(tx)
        );

        const callback = encodeURIComponent(location.href.split("?")[0]);
        const link = `okx://wallet/dapp/transaction?tx=${encoded}&callback=${callback}`;
        window.location.href = link;
        return "WAITING_SIGN";
    }
}