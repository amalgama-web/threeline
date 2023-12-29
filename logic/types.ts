export interface Cell {
    type: CellTypes,
    highlighted: boolean,
    forRemoving: boolean,
    vLine: string,
    hLine: string,
    square: string,
    emergingBooster?: Booster | null,
    booster?: BoosterTypes | null,
}

// todo class NewCell implements Cell


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
    booster?: Booster | null,
    sunPart?: boolean,
}

export interface Squares {
    [squareId: string]: Square
}

export interface Square {
    coords: Coords,
    disabled: boolean,
    booster: Booster | null
}

export enum CellTypes {
    empty,
    yellow,
    red,
    blue,
    pink,
    purple,
    booster,
}

export enum BoosterTypes {
    vRocket = 1,
    hRocket,
    snowflake,
    sun,
}

export interface Booster {
    type: BoosterTypes,
    coords: Coords
}

export interface Variant {
    swap: SwapCells,
    points: number,
    variantHasSun: boolean,
    variantDescendantHasSun?: boolean,
    childVariants: Variant[] | null,
}
export type SwapCells = [
    Coords,
    Coords
]