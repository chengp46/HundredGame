import { _decorator, Component, Node } from 'cc';
import core, { DlgResource } from 'db://assets/framework/scripts/GameCore';
import { GameView } from '../game/GameView';
import { protoReq } from '../common/Request';
const { ccclass, property } = _decorator;

@ccclass('HallView')
@DlgResource("prefab/hall/hallView", "game_baccarat")
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
        core.scene.changeView(GameView, (view: GameView) => {
        });
    }

    onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case 'GUEST':
                core.data.playType = 1;
                core.data.gameType = 2;
                break
            case 'NORMAL':
                core.data.playType = 1;
                core.data.gameType = 2;
                break;
            default:
                break;
        }
        protoReq.sendEnterRoom(core.data.playType, core.data.gameType);
    }
}


