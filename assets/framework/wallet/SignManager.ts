import { WalletManager } from "./WalletManager";

export class SignManager {

    static async login(nonce: string) {
        const wallet = WalletManager.getProvider();
        const address = await wallet.connect();
        //const message = `LOGIN TO WEB3 GAME Address:${address} Nonce:${nonce} Time:${Date.now()}`;
        const signature = await wallet.signMessage(nonce);
        return {
            address,
            nonce,
            signature
        };
    }
}