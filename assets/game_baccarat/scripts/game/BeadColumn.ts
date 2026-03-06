import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BeadColumn')
export class BeadColumn extends Component {

    @property({ type: Prefab, displayName: "大路项" })
    beadItemPrefab: Prefab = null;

    start() {
        this.addBeadItem();
        this.addBeadItem();
    }

    addBeadItem() {
        let item = instantiate(this.beadItemPrefab);
        if (item) {
            item.parent = this.node;
        }
    }

}


