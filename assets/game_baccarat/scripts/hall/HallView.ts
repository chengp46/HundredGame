import { _decorator, Component, Node } from 'cc';
import { GameView } from '../game/GameView';
import { protoReq } from '../common/Request';
import core, { DlgResource } from 'db://assets/framework/GameCore';
import { WalletManager } from 'db://assets/framework/wallet/WalletManager';
import { SignManager } from '../../../framework/wallet/SignManager';
import { IWalletProvider } from 'db://assets/framework/wallet/core/IWalletProvider';

const { ccclass, property } = _decorator;

@ccclass('HallView')
@DlgResource({ bundle: "game_baccarat", path: "prefab/hall/hallView", cache: false })
export class HallView extends core.UIView {

    gameType: number = 0;

    start() {
        //core.message.on("enter_room_resp", this.onEnterRoomResp, this);
        //core.speech.speak("欢迎进入游戏");
        core.message.on("login_resp", this.onLoginResp, this);
    }

    protected onDestroy(): void {
        core.message.offAll(this);
    }

    // 进入房间
    onEnterRoomResp(event: string, data: any) {
        console.log("进入房间:", data);
        // core.scene.changeView(GameView, (view: GameView) => {
        // });
    }

    onLoginResp(event: string, data: any) {
        console.log("登录响应:", data);
        core.data.userInfo.address = data?.address;
        core.data.userInfo.access_token = data?.access_token;
        core.data.userInfo.balance = data?.balance;
        core.scene.changeView(GameView, (view: GameView) => {
        });
    }

    async onButtonClick(event: Event, customData: string) {
        const wallet = WalletManager.getProvider();
        switch (customData) {
            case 'GUEST':
                core.data.playType = 1;
                core.data.gameType = 2;
                core.scene.changeView(GameView, (view: GameView) => {
                });
                break
            case 'NORMAL':
                // 构造交易参数
              const account = await wallet.connect();
              this.withdraw(account,wallet)

            //   const txParams = {
            //         from: account,
            //         to: "0x8464135c8F25Da09e49BC8782676a84730C318bC",
            //         value: "0x" + (1e18).toString(16),
            //         };

            //     await wallet.sendTransaction(txParams);
                break;
            case 'WALLET':
                const address = await wallet.connect();
                let param = { address: address };
                let httpReq = new core.httpReq();
                let result = await httpReq.postAsync("http://192.168.100.62:7000/api/login/nonce", param);
                console.log(`nonce: ${JSON.stringify(result.data)}`);
                const signature = await wallet.signMessage(result.data.once);
                protoReq.sendLoginReq(address, result.data.once, signature);
                break;
            default:
                break;
        }
        // protoReq.sendEnterRoom(core.data.playType, core.data.gameType);
    }

   async deposit(account:string,wallet:IWalletProvider){
        const txParams = {
        from: account,
        to: "0x8464135c8F25Da09e49BC8782676a84730C318bC",
        data: "0xf4d4c9d700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001bc16d674ec80000",
        value: "0x" + (2e18).toString(16)
        };
        await wallet.sendTransaction(txParams);
    }

    async withdraw(account:string,wallet:IWalletProvider){
        const txParams = {
        from: account,
        to: "0x8464135c8F25Da09e49BC8782676a84730C318bC",
        data: "0x3f48991400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001bc16d674ec80000",
        value: "0x0"
        };
        await wallet.sendTransaction(txParams);
    }
}


