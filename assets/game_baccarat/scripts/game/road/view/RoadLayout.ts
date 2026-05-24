export interface RoadPos {
    col: number;
    row: number;
    data: any;
}

export class RoadLayout {

    maxRow = 6;

    build(road: any[][]): RoadPos[] {
        const list: RoadPos[] = [];
        for (let c = 0; c < road.length; c++) {
            const column = road[c];
            for (let r = 0; r < column.length; r++) {
                list.push({ col: c, row: r, data: column[r], });
            }
        }
        return list;
    }
}