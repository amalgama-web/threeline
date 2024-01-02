import Variants from "~/components/variants.vue";
import { MATRIX_HEIGHT, MATRIX_LAST_COL, MATRIX_LAST_ROW, MATRIX_WIDTH } from "~/logic/constant-params";

export interface Cell {
    type: CellTypes,
    isCellForRemoving: boolean,
    isCellInFigure: boolean,
    vLine: string | null,
    hLine: string | null,
    square: string | null,
    emergingBooster?: Booster | null,
    booster?: BoosterTypes | null,
}

export class ZeroCell implements Cell {
    type = CellTypes.empty;
    isCellForRemoving = false;
    isCellInFigure = false;
    vLine = null;
    hLine = null;
    square = null;
    emergingBooster = null;
    booster = null;
}


export type Matrix = Cell[][];

export class CMatrix {
    constructor() {
        return Array(MATRIX_HEIGHT).fill(Array(MATRIX_WIDTH).fill(new ZeroCell()))
    }
}
export function createMatrix(): Matrix {
    let newMatrix = Array(MATRIX_HEIGHT).fill(Array(MATRIX_WIDTH).fill(null));
    newMatrix = newMatrix.map((row: []) => row.map((cell: Cell) => new ZeroCell()))
    return newMatrix;
}


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
