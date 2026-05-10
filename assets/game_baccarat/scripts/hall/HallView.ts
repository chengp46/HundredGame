import { _decorator, Component, Node } from 'cc';
import { GameView } from '../game/GameView';
import { protoReq } from '../common/Request';
import core, { DlgResource } from 'db://assets/framework/GameCore';
import { WalletManager } from 'db://assets/framework/wallet/WalletManager';
import { SignManager } from '../../../framework/wallet/SignManager';
const { ccclass, property } = _decorator;

@ccclass('HallView')
@DlgResource({ bundle: "game_baccarat", path: "prefab/hall/hallView", cache: false })
export class HallView extends core.UIView {

    gameType: number = 0;

    start() {
        core.message.on("enter_room_resp", this.onEnterRoomResp, this);
        core.speech.speak("欢迎进入游戏");
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

    async onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case 'GUEST':
                core.data.playType = 1;
                core.data.gameType = 2;
                break
            case 'NORMAL':
                core.data.playType = 1;
                core.data.gameType = 2;
                break;
            case 'WALLET':
                const wallet = WalletManager.getProvider();
                const address = await wallet.connect();
                let param = { address: address };
                let httpReq = new core.httpReq();
                let result = await httpReq.postAsync("http://192.168.100.62:7000/api/login/nonce", param);
                console.log(`nonce: ${JSON.stringify(result.data)}`);
                const signature = await wallet.signMessage(result.data.once);
                
                break;
            default:
                break;
        }
        // protoReq.sendEnterRoom(core.data.playType, core.data.gameType);
    }
}


