import { _decorator, Component, Node } from 'cc';
import core, { DlgResource } from 'db://assets/framework/scripts/GameCore';
import { OperratorArea } from './OperratorArea';
import { DealArea } from './DealArea';
const { ccclass, property } = _decorator;

@ccclass('GameView')
@DlgResource("prefab/game/gameView", "game_baccarat")
export class GameView extends core.UIView {

    @property({ type: DealArea, displayName: "发牌区" })
    dealArea: DealArea = null;

    @property({ type: OperratorArea, displayName: "操作区" })
    operator: OperratorArea = null;

    start() {
        core.message.on("bet_push", this.onBetPush, this);
        core.message.on("phase_change_push", this.onPhaseChangePush, this);
        core.message.on("enter_room_resp", this.onEnterRoomResp, this);
        core.message.on("leave_room_resp", this.onLeaveRoomResp, this);
        core.message.on("roads_resp", this.onRoadsResp, this);
    }

    protected onDestroy(): void {
        core.message.offAll(this)
    }

    onBetPush(event: string, data: any) {

    }

    // 阶段信息变更推送
    onPhaseChangePush(event: string, data: any) {

    }

     // 进入房间
    onEnterRoomResp(event: string, data: any) {

    }

    // 离开房间
    onLeaveRoomResp(event: string, data: any) {

    }

     // 大厅路单
    onRoadsResp(event: string, data: any) {

    }

    

}


