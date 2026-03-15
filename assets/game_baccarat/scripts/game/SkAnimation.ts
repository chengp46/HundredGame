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
export class SkAnimation extends Component {

    @property({ type: Node, displayName: "动画" })
    animation: Node = null;

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

    playAnimation(type: AnimationType, callback?:()=>void) {
        this.node.active = true;
        let skeleton = this.animation.getComponent(sp.Skeleton);
        skeleton.setEndListener(()=>{
            callback && callback();
        });
        let animName = "";
        switch (type) {
            case AnimationType.START_BET:
                core.speech.speak("开始下注");
                skeleton.skeletonData = this.betAnim;
                animName = core.language.CurrentLanguage == "zh" ? "ksxz_cn" : "ksxz_en";
                skeleton.setAnimation(0, animName, false);
                break;
            case AnimationType.STOP_BET:
                core.speech.speak("停止下注");
                skeleton.skeletonData = this.betAnim;
                animName = core.language.CurrentLanguage == "zh" ? "tzxz_cn" : "tzxz_en";
                skeleton.setAnimation(0, animName, false);
                break;
            case AnimationType.TIE_WIN:
                core.speech.speak("和赢");
                skeleton.skeletonData = this.tieWin;
                animName = core.language.CurrentLanguage == "zh" ? "cn1" : "en1";
                skeleton.setAnimation(0, animName, false);
                break;
            case AnimationType.PLAYER_WIN:
                core.speech.speak("闲赢");
                skeleton.skeletonData = this.playerWin;
                animName = core.language.CurrentLanguage == "zh" ? "cn1" : "en1";
                skeleton.setAnimation(0, animName, false);
                break;
            case AnimationType.BANKER_WIN:
                core.speech.speak("庄赢");
                skeleton.skeletonData = this.bankerWin;
                animName = core.language.CurrentLanguage == "zh" ? "cn1" : "en1";
                skeleton.setAnimation(0, animName, false);
                break;
        } 
    }
}


