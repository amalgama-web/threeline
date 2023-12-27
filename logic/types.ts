export interface Cell {
    type: CellTypes | null,
    highlighted: boolean,
    deleted: boolean,
    vLine: [],
    hLine: [],
    square: [],
    appliedBooster: [],
    booster: [],
}

export type Matrix = Cell[][];

export interface Coords {
    r: number,
    c: number,
}

export interface Lines {
    [lineId: string]: Line
}

export interface Line {
    coords: Coords,
    length: number,
    disabled: boolean,
    booster?: Booster
}

export interface Squares {
    [squareId: string]: Square
}

export interface Square {
    coords: Coords,
    disabled: boolean
}

export enum CellTypes {
    Yellow,
    Red,
    Blue,
    Pink,
    Purple,
    Booster
}

export enum BoosterTypes {
    vRocket = 1,
    hRocket,
    snowflake,
    sun,
}

export interface Booster {
    type: BoosterTypes,
    coords: Coords | null
}

export type SwapCells = [
    Coords,
    Coords
]