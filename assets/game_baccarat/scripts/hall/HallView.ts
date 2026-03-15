import { _decorator, Component, Node } from 'cc';
import core, { DlgResource } from 'db://assets/framework/scripts/GameCore';
import { GameView } from '../game/GameView';
import { protoReq } from '../common/Request';
const { ccclass, property } = _decorator;

@ccclass('HallView')
@DlgResource("prefab/hall/hallView", "game_baccarat")
export class HallView extends core.UIView {
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
        core.scene.changeView(GameView);
    }

    onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case 'GUEST':
                protoReq.sendEnterRoom(1, 2);
                break
            case 'NORMAL':
                protoReq.sendEnterRoom(2, 2);
                break;
            default:
                break;
        }
    }
}


