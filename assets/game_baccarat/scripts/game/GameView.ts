import { _decorator, Component, Label, Node } from 'cc';
import core, { DlgResource } from 'db://assets/framework/scripts/GameCore';
import { OperratorArea } from './OperratorArea';
import { CardData, DealArea } from './DealArea';
import { protoReq } from '../common/Request';
import { HallView } from '../hall/HallView';
import { NodeController } from 'db://assets/framework/scripts/component/NodeController';
import { AnimationType, SkAnimation } from './SkAnimation';
const { ccclass, property } = _decorator;

@ccclass('GameView')
@DlgResource("prefab/game/gameView", "game_baccarat")
export class GameView extends core.UIView {

    @property({ type: DealArea, displayName: "发牌区" })
    dealArea: DealArea = null;

    @property({ type: Label, displayName: "发牌区" })
    hash: Label = null;

    @property({ type: Node, displayName: "下注区" })
    betArea: Node = null;

    @property({ type: OperratorArea, displayName: "操作区" })
    operator: OperratorArea = null;

    @property({ type: SkAnimation, displayName: "动画" })
    anim: SkAnimation = null;


    start() {
        core.message.on("bet_push", this.onBetPush, this);
        core.message.on("phase_change_push", this.onPhaseChangePush, this);
        core.message.on("leave_room_resp", this.onLeaveRoomResp, this);
        core.message.on("roads_resp", this.onRoadsResp, this);

        let ctrl = this.betArea.getComponent(NodeController);
        if (core.data.gameType === 1) {
            ctrl.StateIndex = 0;
        } else if (core.data.gameType === 2) {
            ctrl.StateIndex = 1;
        }
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
        if (data.code == -1) {
            return;
        }
        if (data.is_self) {
            this.operator.playerBet(data.zone, data.amount, data.all_role_amount, data.all_room_amount);
        } else {
            this.operator.otherBet(data.zone, data.amount, data.all_role_amount, data.all_room_amount);
        }
    }

    // 阶段信息变更推送
    onPhaseChangePush(event: string, data: any) {
        //console.log("阶段信息变更推送:", data);
        let curTime = data.cut_off_time - Date.now();
        this.dealArea.setCountdown(Math.floor(curTime / 1000), data.phase, null);
        switch (data.phase) {
            case 0: // 准备
                this.dealArea.clear();
                this.operator.clear();
                this.anim.node.active = false;
                break;
            case 1: // 发牌
                this.dealArea.dealCard();
                this.hash.string = `哈希码:${data.deal_info.hash_value}`;
                break;
            case 2: // 下注
                this.anim.playAnimation(AnimationType.START_BET);
                break;
            case 3: // 结算
                this.anim.playAnimation(AnimationType.STOP_BET, () => {
                    let playerCards: CardData[] = [];
                    for (const k in data.deal_info.player_cards) {
                        let card = new CardData();
                        card.point = Number(k);
                        card.suit = data.deal_info.player_cards[k];
                        playerCards.push(card);
                    }
                    let bankerCards: CardData[] = [];
                    for (const k in data.deal_info.banker_cards) {
                        let card = new CardData();
                        card.point = Number(k);
                        card.suit = data.deal_info.banker_cards[k];
                        bankerCards.push(card);
                    }
                    this.dealArea.openCard(playerCards, bankerCards, () => {
                        if (data.result_type == 7) {
                            this.anim.playAnimation(AnimationType.BANKER_WIN);
                        } else if (data.result_type == 8) {
                            this.anim.playAnimation(AnimationType.PLAYER_WIN);
                        } else if (data.result_type == 9) {
                            this.anim.playAnimation(AnimationType.TIE_WIN);
                        }
                    });
                });
                console.log("结算: ", data);
                break;
        }
    }

    // 离开房间
    onLeaveRoomResp(event: string, data: any) {
        core.scene.changeView(HallView);
    }

    // 大厅路单
    onRoadsResp(event: string, data: any) {
        console.log("路单数据:", data);
    }
}


