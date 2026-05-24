import { _decorator, Component, Label } from "cc";
import core from "db://assets/framework/GameCore";

const { ccclass, property } = _decorator;

@ccclass('InfoArea')
export class InfoArea extends Component {

    @property({ type: Label, displayName: "余额" })
    balance: Label = null;

    start() {
        this.balance.string = core.data.userInfo.balance?.ETH;
    }
}


