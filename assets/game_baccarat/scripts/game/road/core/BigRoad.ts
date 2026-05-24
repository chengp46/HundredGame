import { BaccaratResult, RoadCell, } from "./BaccaratDefine";
import { RoadTable } from "./RoadTable";


export class BigRoad extends RoadTable {

    add(result: BaccaratResult) {
        // ===== 和局 =====
        if (result === BaccaratResult.Tie) {
            const last = this.lastCell;
            if (last) {
                last.tieCount++;
            }
            return false; // 不触发派生路
        }
        const cell: RoadCell = { result, tieCount: 0, };
        this.addCell(cell);
        return true;
    }
}