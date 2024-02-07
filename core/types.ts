import { Matrix } from './classes/Matrix';

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
    disabled?: boolean,
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


// типы ячеек которые могу образовывать фигур (не бустеры и не пустые)
export const TypesForShapes: CellTypes[] = [
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
    variantDescendantHasSun: boolean,
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
    [key in CellTypes]: number
}

export type BoostersActions = {
    [key in BoosterTypes]: (m: Matrix, coords: Coords) => void;
}

export type TMatrix<T> = T[][];

export type SnowflakeRay = {
    direction: string,
    rInc: -1 | 0 | 1,
    cInc: -1 | 0 | 1,
}

export const snowflakeRays: SnowflakeRay[] = [
    {
        direction: 'top',
        rInc: -1,
        cInc: 0
    },
    {
        direction: 'right',
        rInc: 0,
        cInc: 1
    },
    {
        direction: 'bottom',
        rInc: 1,
        cInc: 0
    },
    {
        direction: 'left',
        rInc: 0,
        cInc: -1
    },
]

