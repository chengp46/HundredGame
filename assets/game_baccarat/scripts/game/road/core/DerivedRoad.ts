import { DerivedColor, RoadMap } from "./BaccaratDefine";
import { RoadTable } from "./RoadTable";


export class DerivedRoad extends RoadTable {

    private offset: number;

    constructor(offset: number) {
        super();
        this.offset = offset;
    }

    update(bigRoad: RoadMap) {

        const col = bigRoad.length - 1;

        if (col < this.offset) return;

        const curr = bigRoad[col];
        const ref = bigRoad[col - this.offset];

        if (!curr || !ref) return;

        const color = (curr.length === ref.length ? DerivedColor.Red : DerivedColor.Blue);
        this.addCell({ result: color as any, tieCount: 0, });
    }
}