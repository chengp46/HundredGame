import { _decorator, Component, EditBox, Node } from 'cc';
import { Dropdown } from 'db://assets/framework/component/dropdown/Dropdown';
import { DropdownData } from 'db://assets/framework/component/dropdown/DropdownData';
import core, { DlgResource } from 'db://assets/framework/GameCore';
import { IWalletProvider } from 'db://assets/framework/wallet/core/IWalletProvider';
import { WalletManager } from 'db://assets/framework/wallet/WalletManager';
const { ccclass, property } = _decorator;

@ccclass('TransferDlg')
@DlgResource({ path: "prefab/game/transfer/transferDlg", bundle: "game_baccarat", cache: false })
export class TransferDlg extends core.UIDialog {

    @property({ type: Dropdown, displayName: "资产" })
    assert: Dropdown = null!;

    @property({ type: Dropdown, displayName: "链" })
    chain: Dropdown = null!;

    @property({ type: EditBox, displayName: "金额" })
    balance: EditBox = null!;

    start() {
        this.assert.setData([
            { id: 1, text: 'USDC' },
            { id: 2, text: 'ETH' },
            { id: 3, text: 'USDT' }
        ]);
        this.assert.onChanged = this.onChanged.bind(this);

        this.chain.setData([
            { id: 1, text: "Arbitrum" }
        ]);
    }

    async onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case 'cancel':
                this.close();
                break
            case "sure":
                const wallet = WalletManager.getProvider();
                const account = await wallet.connect();
                await this.withdraw(account, wallet)
                break;
            default:
                break;
        }
    }

    

    async withdraw(account: string, wallet: IWalletProvider) {
        const txParams = {
            from: account,
            to: "0x8464135c8F25Da09e49BC8782676a84730C318bC",
            data: "0x3f48991400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001bc16d674ec80000",
            value: "0x0"
        };
        await wallet.sendTransaction(txParams);
    }

    onChanged(index: number, data: DropdownData) {
        console.log("data:", index, data);
    }
}


