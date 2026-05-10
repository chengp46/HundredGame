import { DeepLinkProvider } from "./core/DeepLinkProvider";
import { InjectedProvider } from "./core/InjectedProvider";
import { IWalletProvider } from "./core/IWalletProvider";
import { WalletDetect } from "./core/WalletDetect";


export class WalletManager {

    private static provider: IWalletProvider;

    static getProvider(): IWalletProvider {

        if (this.provider) return this.provider;

        if (WalletDetect.hasInjected())
            this.provider = new InjectedProvider();
        else
            this.provider = new DeepLinkProvider();

        return this.provider;
    }
}