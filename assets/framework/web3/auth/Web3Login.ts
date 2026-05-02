import { WalletManager } from "../core/WalletManager";
import { Web3API } from "./Web3API";

export class Web3Login {

    static async login() {
        const addr = WalletManager.address();
        const nonce = await Web3API.getNonce(addr);
        const sign = await WalletManager.sign(nonce);
        return Web3API.login(addr, sign);
    }
}