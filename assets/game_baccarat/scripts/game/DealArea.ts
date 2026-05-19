import { _decorator, Component, instantiate, Label, Layout, Node, NodePool, tween, v3, Vec3 } from 'cc';
import { Poker } from './Poker';
import core from 'db://assets/framework/GameCore';
const { ccclass, property } = _decorator;

export class CardData {
    suit: number;
    point: number;
}

@ccclass('DealArea')
export class DealArea extends Component {
    @property({ type: Label, displayName: "闲家点数" })
    playerPoint: Label = null;

    @property({ type: Label, displayName: "庄家点数" })
    bankerPoint: Label = null;

    @property({ type: [Poker], displayName: "闲家牌" })
    playerPoker: Poker[] = [];

    @property({ type: [Poker], displayName: "庄家牌" })
    bankerPoker: Poker[] = [];

    @property({ type: Node, displayName: "牌" })
    pokerNode: Node = null;

    @property({ type: Label, displayName: "局ID" })
    roundId: Label = null;

    @property({ type: Label, displayName: "倒计时" })
    countdown: Label = null;

    dealPos: Vec3 = v3();
    time: number = 0;

    start() {
        this.dealPos = this.pokerNode.position;
        this.pokerNode.active = false;
        this.countdown.node.active = false;
        this.hidePoker();
    }

    protected onDestroy(): void {
    }

    hidePoker() {
        for (let i = 0; i < this.playerPoker.length; i++) {
            this.playerPoker[i].node.active = false;
        }
        for (let i = 0; i < this.bankerPoker.length; i++) {
            this.bankerPoker[i].node.active = false;
        }
    }

    // 0:闲家 1：庄家 珠
    flyCard(type: number, index: number) {
        console.log(`type:${type}  index:${index}.......`);
        return new Promise<Poker>((resolve) => {
            this.pokerNode.position = this.dealPos;
            this.pokerNode.scale = v3(0.5, 0.5, 1);
            this.pokerNode.active = true;
            let poker = (0 == type ? this.playerPoker[index] : this.bankerPoker[index]);
            tween(this.pokerNode).to(0.1, { position: poker.node.position, scale: new Vec3(1, 1, 1) }).call(() => {
                poker.node.active = true;
                this.pokerNode.active = false;
                resolve(poker);
            }).start();
        });
    }

    async dealCard() {
        this.clear();
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                await this.flyCard(i, j);
            }
        }
    }

    async openCard(playerCard: CardData[], bankerCard: CardData[], callback: () => void) {
        if (playerCard.length < 2 || bankerCard.length < 2) {
            return;
        }
        // let pokers = this.playerArea.node.children;
        // let playerPoint = 0;
        // for (let i = 0; i < pokers.length; i++) {
        //     let poker = pokers[i].getComponent(Poker);
        //     poker.setPoker(playerCard[i].suit, playerCard[i].point);
        //     playerPoint += playerCard[i].point >= 10 ? 0 : playerCard[i].point;
        // }
        // pokers = this.bankerArea.node.children;
        // let bankerPoint = 0;
        // for (let i = 0; i < pokers.length; i++) {
        //     let poker = pokers[i].getComponent(Poker);
        //     poker.setPoker(bankerCard[i].suit, bankerCard[i].point);
        //     bankerPoint += bankerCard[i].point >= 10 ? 0 : bankerCard[i].point;
        // }
        // this.playerPoint.string = (playerPoint % 10).toString();
        // this.bankerPoint.string = (bankerPoint % 10).toString();
        // if (playerCard.length === 2) {
        //     core.speech.speak(`闲家${playerPoint % 10}点`);
        //     if (bankerCard.length === 2) {
        //         core.speech.speak(`庄家${bankerPoint % 10}点`, () => {
        //             callback && callback();
        //         });
        //     } else {
        //         await core.util.sleep(1);
        //         let card = await this.flyCard(1);
        //         card.setPoker(bankerCard[2].suit, bankerCard[2].point);
        //         bankerPoint += bankerCard[2].point >= 10 ? 0 : bankerCard[2].point;
        //         bankerPoint = bankerPoint % 10;
        //         this.bankerPoint.string = bankerPoint.toString();
        //         core.speech.speak(`庄家${bankerPoint}点`, () => {
        //             callback && callback();
        //         });
        //     }
        // } else {
        //     await core.util.sleep(1);
        //     let card = await this.flyCard(0);
        //     card.setPoker(playerCard[2].suit, playerCard[2].point);
        //     playerPoint += playerCard[2].point >= 10 ? 0 : playerCard[2].point;
        //     playerPoint = playerPoint % 10;
        //     this.playerPoint.string = playerPoint.toString();
        //     core.speech.speak(`闲家${playerPoint}点`);
        //     if (bankerCard.length === 2) {
        //         bankerPoint = bankerPoint % 10;
        //         this.bankerPoint.string = bankerPoint.toString();
        //         core.speech.speak(`庄家${bankerPoint}点`, () => {
        //             callback && callback();
        //         });
        //     } else {
        //         await core.util.sleep(1);
        //         card = await this.flyCard(1);
        //         card.setPoker(bankerCard[2].suit, bankerCard[2].point);
        //         bankerPoint += bankerCard[2].point >= 10 ? 0 : bankerCard[2].point;
        //         bankerPoint = bankerPoint % 10;
        //         this.bankerPoint.string = bankerPoint.toString();
        //         core.speech.speak(`庄家${bankerPoint}点`, () => {
        //             callback && callback();
        //         });
        //     }
        // }
    }

    setCountdown(time: number, phase: number, callback: (phase: number) => void) {
        if (time <= 0) {
            return;
        }
        this.time = time;
        this.schedule(() => {
            this.countdown.string = this.time.toString();
            this.countdown.node.active = true;
            this.time--;
            if (this.time < 0) {
                this.countdown.node.active = false;
                callback && callback(phase);
                this.unscheduleAllCallbacks();
            }
        }, 1, time);
    }

    clear() {
        this.playerPoint.string = "0";
        this.bankerPoint.string = '0';
    }
}
