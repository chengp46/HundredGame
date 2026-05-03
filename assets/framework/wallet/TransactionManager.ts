import { WalletManager } from "./WalletManager";

export class TransactionManager {

    static async send(tx: any) {
        const address = await WalletManager.getAddress();
        if (!address)
            throw "WALLET_NOT_CONNECTED";

        return await WalletManager.sendTransaction(tx);
    }
}


/**
 * // 连接钱包
await WalletManager.connect();

// 获取地址
const addr = await WalletManager.getAddress();

// 发送交易
await TransactionManager.send({
    from: addr,
    to: "0xabc",
    value: "0x0"
});
 */