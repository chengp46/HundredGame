import { _decorator, Component, Label, Node } from 'cc';
import core from 'db://assets/framework/scripts/GameCore';
const { ccclass, property } = _decorator;

@ccclass('BetItem')
export class BetItem extends Component {
    @property({ type: Label, displayName: "下注金额" })
    betLabel: Label;

    @property({ displayName: "区域ID" })
    areaId: number = 0;

    start() {

    }

    onItemClick(event: Event, customData: string) {
        core.message.dispatchEvent("BetItemClick", this.node, this.areaId);
    }

    setBetAmount(playerBet: number, totalBet: number) {
        this.betLabel.string = `${playerBet}/${totalBet}`;
    }
}


