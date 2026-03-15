import { _decorator, Component, instantiate, Label, Layout, Node, NodePool, tween, v3, Vec3 } from 'cc';
import core from 'db://assets/framework/scripts/GameCore';
import { Poker } from './Poker';
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

    @property({ type: Layout, displayName: "闲家牌区域" })
    playerArea: Layout = null;

    @property({ type: Layout, displayName: "庄家牌区域" })
    bankerArea: Layout = null;

    @property({ type: Node, displayName: "牌" })
    pokerNode: Node = null;

    @property({ type: Label, displayName: "局ID" })
    roundId: Label = null;

    @property({ type: Label, displayName: "倒计时" })
    countdown: Label = null;

    // 筹码池
    pokerPool: NodePool = new NodePool("poker");

    time: number = 0;

    start() {
        this.countdown.node.active = false;
    }

    protected onDestroy(): void {
        this.pokerPool.clear();
    }

    // 0:闲家 1：庄家 珠
    flyCard(type: number, callback?: (card: Poker) => void) {
        let poker: Node = null;
        if (this.pokerPool.size() > 0) {
            poker = this.pokerPool.get();
        } else {
            poker = instantiate(this.pokerNode);
        }
        poker.active = true;
        poker.scale = v3(0.5, 0.5, 1);
        poker.parent = this.node;
        let card = poker.getComponent(Poker);
        card.setPoker(0, 0);
        if (0 == type) {
            tween(poker).to(0.1, { position: this.playerArea.node.position, scale: new Vec3(1, 1, 1) }).call(() => {
                poker.parent = this.playerArea.node;
            }).delay(0.5).call(() => {
                callback && callback(card);
            }).start();
        } else if (1 == type) {
            tween(poker).to(0.1, { position: this.bankerArea.node.position, scale: new Vec3(1, 1, 1) }).call(() => {
                poker.parent = this.bankerArea.node;
            }).delay(0.5).call(() => {
                callback && callback(card);
            }).start();
        }
    }

    dealCard() {
        this.clear();
        for (let i = 0; i < 4; i++) {
            this.flyCard(i % 2);
        }
    }

    openCard(playerCard: CardData[], bankerCard: CardData[], callback: () => void) {
        if (playerCard.length < 2 || bankerCard.length < 2) {
            return;
        }
        let pokers = this.playerArea.node.children;
        let playerPoint = 0;
        for (let i = 0; i < pokers.length; i++) {
            let poker = pokers[i].getComponent(Poker);
            poker.setPoker(playerCard[i].suit, playerCard[i].point);
            playerPoint += playerCard[i].point >= 10 ? 0 : playerCard[i].point;
        }
        pokers = this.bankerArea.node.children;
        let bankerPoint = 0;
        for (let i = 0; i < pokers.length; i++) {
            let poker = pokers[i].getComponent(Poker);
            poker.setPoker(bankerCard[i].suit, bankerCard[i].point);
            bankerPoint += bankerCard[i].point >= 10 ? 0 : bankerCard[i].point;
        }

        if (playerCard.length === 2) {
            playerPoint = playerPoint % 10;
            this.playerPoint.string = playerPoint.toString();
            if (bankerCard.length === 2) {
                bankerPoint = bankerPoint % 10;
                this.bankerPoint.string = bankerPoint.toString();
                core.speech.speak(`闲家${playerPoint}点`);
                core.speech.speak(`庄家${bankerPoint}点`, () => {
                    callback && callback();
                });
            } else {
                this.flyCard(1, (card: Poker) => {
                    card.setPoker(bankerCard[2].suit, bankerCard[2].point);
                    bankerPoint += bankerCard[2].point >= 10 ? 0 : bankerCard[2].point;
                    bankerPoint = bankerPoint % 10;
                    this.playerPoint.string = bankerPoint.toString();
                    core.speech.speak(`闲家${playerPoint}点`);
                    core.speech.speak(`庄家${bankerPoint}点`, () => {
                        callback && callback();
                    });
                });
            }
        } else {
            this.flyCard(0, (card: Poker) => {
                card.setPoker(playerCard[2].suit, playerCard[2].point);
                playerPoint += playerCard[2].point >= 10 ? 0 : playerCard[2].point;
                playerPoint = playerPoint % 10;
                this.playerPoint.string = playerPoint.toString();
                if (bankerCard.length === 2) {
                    bankerPoint = bankerPoint % 10;
                    this.bankerPoint.string = bankerPoint.toString();
                    core.speech.speak(`闲家${playerPoint}点`);
                    core.speech.speak(`庄家${bankerPoint}点`, ()=>{
                        callback && callback();
                    });
                    
                } else {
                    this.flyCard(1, (card: Poker) => {
                        card.setPoker(bankerCard[2].suit, bankerCard[2].point);
                        bankerPoint += bankerCard[2].point >= 10 ? 0 : bankerCard[2].point;
                        bankerPoint = bankerPoint % 10;
                        this.playerPoint.string = bankerPoint.toString();
                        core.speech.speak(`闲家${playerPoint}点`);
                        core.speech.speak(`庄家${bankerPoint}点`, ()=>{
                            callback && callback();
                        });           
                    });
                }
            });
        }
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
            if (this.time <= 0) {
                this.countdown.node.active = false;
                callback && callback(phase);
                this.unscheduleAllCallbacks();
            }
        }, 1, time);
    }

    clear() {
        this.playerPoint.string = "0";
        this.bankerPoint.string = '0';
        let pokers = this.playerArea.node.children;
        for (let i = 0; i < pokers.length; i++) {
            this.pokerPool.put(pokers[i]);
        }
        this.playerArea.node.removeAllChildren();
        pokers = this.bankerArea.node.children;
        for (let i = 0; i < pokers.length; i++) {
            this.pokerPool.put(pokers[i]);
        }
        this.bankerArea.node.removeAllChildren();
        this.countdown.node.active = false;
        this.unscheduleAllCallbacks();
    }
}


