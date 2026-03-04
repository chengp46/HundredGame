import { _decorator, Component, Node } from 'cc';
import core, { DlgResource } from 'db://assets/framework/scripts/GameCore';
import { OperratorArea } from './OperratorArea';
import { DealArea } from './DealArea';
import { protoReq } from '../common/Request';
import { HallView } from '../hall/HallView';
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
        core.message.on("leave_room_resp", this.onLeaveRoomResp, this);
        core.message.on("roads_resp", this.onRoadsResp, this);
    }

    protected onDestroy(): void {
        core.message.offAll(this)
    }

    onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case 'exitGame':
                protoReq.leaveRoomReq();
                break
            default:
                break;
        }
    }

    onBetPush(event: string, data: any) {
        console.log("下注数据：", data);
    }

    // 阶段信息变更推送
    onPhaseChangePush(event: string, data: any) {
        console.log("阶段信息变更推送:", data);
        switch (data.phase) {
            case 0: // 准备
                this.dealArea.clear();
                break;
            case 1: // 发牌
                this.dealArea.dealCard();
                break;
            case 2: // 下注
                break;
            case 3: // 结算
                break;
        }
    }

    // 离开房间
    onLeaveRoomResp(event: string, data: any) {
        core.scene.changeView(HallView);
    }

    // 大厅路单
    onRoadsResp(event: string, data: any) {

    }
}


