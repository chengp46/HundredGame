import { IWallet } from "../wallet/IWallet";
import { MetaMaskWallet } from "../wallet/MetaMaskAdapter";
import { WalletConnectV2 } from "../wallet/WalletConnectV2";
import { WalletSession } from "./WalletSession";

export enum WalletType {
    MetaMask,
    WalletConnect
}

export class WalletManager {

    private static wallet: IWallet;

    static async connect(type: WalletType) {

        switch (type) {
            case WalletType.MetaMask:
                this.wallet = new MetaMaskWallet();
                break;
            case WalletType.WalletConnect:
                this.wallet = new WalletConnectV2();
                break;
        }

        const addr = await this.wallet.connect();
        WalletSession.save(addr);

        return addr;
    }

    static async sign(msg: string) {
        return this.wallet.sign(msg);
    }

    static address() {
        return this.wallet?.getAddress();
    }
}