import { RoadMap, RoadCell } from "./BaccaratDefine";

export class RoadTable {

    readonly MAX_ROW = 6;

    road: RoadMap = [];

    clear() {
        this.road.length = 0;
    }

    get lastColumn() {
        return this.road[this.road.length - 1];
    }

    get lastCell(): RoadCell | null {
        const col = this.lastColumn;
        return col ? col[col.length - 1] : null;
    }

    addCell(cell: RoadCell) {
        if (this.road.length === 0) {
            this.road.push([cell]);
            return;
        }

        const lastCol = this.lastColumn!;
        const last = this.lastCell!;

        // 同列向下
        if (last.result === cell.result) {
            const nextRow = lastCol.length;
            if (nextRow < this.MAX_ROW && !this.hasBlock(this.road.length - 1, nextRow)) {
                lastCol.push(cell);
            } else {
                this.road.push([cell]);
            }
        } else {
            // 新列
            this.road.push([cell]);
        }
    }

    private hasBlock(col: number, row: number) {
        return this.road[col]?.[row] != null;
    }
}