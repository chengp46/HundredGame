import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BeadPlate')
export class BeadPlate extends Component {

    @property({ type: Prefab, displayName: "珠盘路列" })
    beadColumnPrefab: Prefab = null;

    start() {

    }

    addBeadColumn() {
        let column = instantiate(this.beadColumnPrefab);
        if (column) {
            column.parent = this.node;
        }
    }

}


