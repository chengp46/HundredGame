import { _decorator, Component, instantiate, Label, Layout, Node, NodePool, tween, v3, Vec3 } from 'cc';
import core from 'db://assets/framework/scripts/GameCore';
import { Poker } from './Poker';
const { ccclass, property } = _decorator;

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

    start() {

    }

    protected onDestroy(): void {
        this.pokerPool.clear();
    }

    // 0:闲家 1：庄家
    flyCard(type: number) {
        let poker: Node = null;
        if (this.pokerPool.size() > 0) {
            poker = this.pokerPool.get();
        } else {
            poker = instantiate(this.pokerNode);
        }
        poker.active = true;
        poker.scale = v3(0.5, 0.5, 1);
        poker.parent = this.node;
        if (0 == type) {
            tween(poker).to(0.1, { position: this.playerArea.node.position, scale: new Vec3(1, 1, 1) }).call(() => {
                poker.parent = this.playerArea.node;
            }).start();
        } else if (1 == type) {
            tween(poker).to(0.1, { position: this.bankerArea.node.position, scale: new Vec3(1, 1, 1) }).call(() => {
                poker.parent = this.bankerArea.node;
            }).start();
        }
    }

    dealCard() {
        for (let i = 0; i < 4; i++) {
            this.flyCard(i % 2);
        }
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
    }
}


