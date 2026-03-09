import { _decorator, Component, Node, sp } from 'cc';
import core from 'db://assets/framework/scripts/GameCore';
const { ccclass, property } = _decorator;

export enum AnimationType {
    START_BET = 0,
    STOP_BET,
    TIE_WIN,
    PLAYER_WIN,
    BANKER_WIN,
}

@ccclass('Animation')
export class Animation extends Component {

    @property({ type: sp.SkeletonData, displayName: "下注" })
    betAnim: sp.SkeletonData = null;

    @property({ type: sp.SkeletonData, displayName: "和赢" })
    tieWin: sp.SkeletonData = null;

    @property({ type: sp.SkeletonData, displayName: "闲赢" })
    playerWin: sp.SkeletonData = null;

    @property({ type: sp.SkeletonData, displayName: "庄赢" })
    bankerWin: sp.SkeletonData = null;

    start() {

    }

    playAnimation(type: AnimationType) {
        let skeleton = this.node.getComponent(sp.Skeleton);
        let animName = "";
        switch (type) {
            case AnimationType.START_BET:
                skeleton.skeletonData = this.betAnim;
                animName = core.language.CurrentLanguage == "zh" ? "ksxz_cn" : "ksxz_en"; 
                skeleton.setAnimation(0, animName, false);
                break;
            case AnimationType.STOP_BET:
                break;
        }
    }

}


