export interface Cell {
    type: CellTypes,
    isCellForRemoving: boolean,
    isCellInShape: boolean,
    vLine: string | null,
    hLine: string | null,
    square: string | null,
    // todo убрать необязательный параметр потом когда не будет ошибок
    emergingBooster: Booster | null,
    booster?: BoosterTypes | null,
}

export class ZeroCell implements Cell {
    type = CellTypes.empty;
    isCellForRemoving = false;
    isCellInShape = false;
    vLine = null;
    hLine = null;
    square = null;
    emergingBooster = null;
    booster = null;
}



export type TMatrix<T> = T[][];

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
    booster: Booster | null,
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

// типы ячеек для комбинаций
export const TypesForShapes = [
    CellTypes.yellow,
    CellTypes.red,
    CellTypes.blue,
    CellTypes.pink,
    CellTypes.purple
]

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

export enum SnowflakeMoveDirections {
    default,
    top,
    right,
    bottom,
    left
}

export interface SnowflakeVariant {
    points: number,
    childVariants: Variant[]
}

export type SnowflakeMovingVariants = {
    [key in SnowflakeMoveDirections]: SnowflakeVariant | null
}

export type TypesCounter = {
    [type in CellTypes]: number
}