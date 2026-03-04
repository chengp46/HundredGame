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
    }

    protected onDestroy(): void {
        core.message.offAll(this)
    }

    onBetPush(event: string, data: any) {

    }

}


