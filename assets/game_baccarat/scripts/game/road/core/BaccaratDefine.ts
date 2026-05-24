export enum BaccaratResult {
    Banker = 1,
    Player = 2,
    Tie = 3,
}

export enum DerivedColor {
    Red = 1,
    Blue = 2,
}

export interface RoadCell {
    result: BaccaratResult;
    tieCount: number;
}

export type RoadColumn = RoadCell[];
export type RoadMap = RoadColumn[];