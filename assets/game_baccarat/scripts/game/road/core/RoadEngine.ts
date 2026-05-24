import { BaccaratResult } from "./BaccaratDefine";
import { BigRoad } from "./BigRoad";
import { DerivedRoad } from "./DerivedRoad";

export class RoadEngine {

    bigRoad = new BigRoad();

    bigEye = new DerivedRoad(1);
    smallRoad = new DerivedRoad(2);
    cockroach = new DerivedRoad(3);

    addResult(result: BaccaratResult) {

        const changed = this.bigRoad.add(result);

        if (!changed) return;

        const big = this.bigRoad.road;

        this.bigEye.update(big);
        this.smallRoad.update(big);
        this.cockroach.update(big);
    }

    clear() {
        this.bigRoad.clear();
        this.bigEye.clear();
        this.smallRoad.clear();
        this.cockroach.clear();
    }
}