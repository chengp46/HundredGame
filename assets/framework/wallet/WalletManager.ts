
import { WalletStateMachine } from "./WalletStateMachine";
import { DeepLinkProvider } from "./providers/DeepLinkProvider";
import { InjectedProvider } from "./providers/InjectedProvider";
import { WalletDetect } from "./providers/WalletDetect";
import { WalletState, IWalletProvider } from "./types";

export class WalletManager {

    private static provider: IWalletProvider;
    private static sm = new WalletStateMachine();

    static async connect() {
        this.sm.setState(WalletState.DETECTING);
        if (WalletDetect.canInjected()) {
            this.provider = new InjectedProvider();
        }
        else {
            this.provider = new DeepLinkProvider();
        }

        this.sm.setState(WalletState.CONNECTING);
        const addr = await this.provider.connect();
        if (addr !== "WAITING_CALLBACK") {
            this.sm.setState(WalletState.CONNECTED);
        }
        return addr;
    }

    static async getAddress() {

        if (!this.provider)
            this.provider = new DeepLinkProvider();

        const addr = await this.provider.getAddress();

        if (addr)
            this.sm.setState(WalletState.CONNECTED);

        return addr;
    }

    static async sendTransaction(tx: any) {
        this.sm.setState(WalletState.SIGNING);
        const hash = await this.provider.sendTransaction(tx);
        this.sm.setState(WalletState.CONNECTED);
        return hash;
    }
}