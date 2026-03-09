import { _decorator, Component, Node } from 'cc';
import { BeadPlate } from './BeadPlate';
import { BigRoad } from './BigRoad';
const { ccclass, property } = _decorator;

@ccclass('LudanArea')
export class LudanArea extends Component {

    @property({ type: BeadPlate, displayName: "珠盘路" })
    beadPlate: BeadPlate = null;

    @property({ type: BigRoad, displayName: "大路" })
    bigRoad: BigRoad = null;

    start() {
        this.beadPlate.addBeadColumn();
        this.beadPlate.addBeadColumn();
    }

}


