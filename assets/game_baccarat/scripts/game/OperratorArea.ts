import { _decorator, Component, instantiate, Node, NodePool, Prefab, tween, v3, Vec3 } from 'cc';
import core from 'db://assets/framework/scripts/GameCore';
import { ChipNode } from './ChipNode';
import { BetItem } from './BetItem';
const { ccclass, property } = _decorator;

@ccclass('OperratorArea')
export class OperratorArea extends Component {

    @property({ type: [Node], displayName: "筹码列表" })
    chipArr: Node[] = [];

    @property({ type: Prefab, displayName: "筹码节点" })
    chipPrefab: Prefab = null;

    @property({ type: [BetItem], displayName: "下注项" })
    betItemArr: BetItem[] = [];

    @property({ type: Node, displayName: "其他玩家" })
    otherPlayer: Node = null;

    // 筹码池
    chipPool: NodePool = new NodePool("chipPool");
    // 筹码金额
    chipAmount: number[] = [1, 5, 10, 50, 100];

    selectIndex: number = 0;

    start() {
        core.message.on("BetItemClick", this.onBetItemCallback, this);
    }

    protected onDestroy(): void {
        core.message.offAll(this);
    }

    onToggleCallback(event: Event, customEventData: string) {
        this.selectIndex = Number(customEventData) - 1;
    }

    onBetItemCallback(event: string, node: Node, areaId: number) {
        let chip: Node = null;
        if (this.chipPool.size() > 0) {
            chip = this.chipPool.get();
        } else {
            chip = instantiate(this.chipPrefab);
        }
        let chipNode = chip.getComponent(ChipNode);
        chipNode.setChip(this.selectIndex);
        chip.parent = this.node;
        let localPos = new Vec3();
        chip.position = this.node.inverseTransformPoint(localPos, this.chipArr[this.selectIndex].worldPosition);
        this.node.inverseTransformPoint(localPos, node.worldPosition);
        tween(chip).to(0.3, { position: localPos }, { easing: "quadOut" }).call(() => {
            this.chipPool.put(chip);
            //core.wssock.send(JSON.stringify({ msg_id: "betting_req", mode: 0, amount: this.chipAmount[this.selectIndex], zone: areaId }));
        }).start();
    }

    otherBet(areaId: number, amount: number) {
        let betItem = this.betItemArr.find(v => v.areaId == areaId);
        if (betItem) {
            let chip: Node = null;
            if (this.chipPool.size() > 0) {
                chip = this.chipPool.get();
            } else {
                chip = instantiate(this.chipPrefab);
            }
            let chipNode = chip.getComponent(ChipNode);
            let index = this.chipAmount.findIndex(v => v == amount);
            chipNode.setChip(index);
            chip.parent = this.node;
            chip.position = this.otherPlayer.position;
            let localPos = new Vec3();
            this.node.inverseTransformPoint(localPos, betItem.node.worldPosition);
            tween(this.otherPlayer).by(0.1, {position: v3(-3, 3, 0)}).by(0.1, {position: v3(3, -3, 0)}).start();
            tween(chip).to(0.3, { position: localPos }, { easing: "quadOut" }).call(() => {
                this.chipPool.put(chip);
                //core.wssock.send(JSON.stringify({ msg_id: "betting_req", mode: 0, amount: this.chipAmount[this.selectIndex], zone: areaId }));
            }).start();
        }
    }

    onButtonClick(event: Event, customData: string) {
        this.otherBet(7, 50);
    }

}

