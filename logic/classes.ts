import { Booster, BoosterTypes, CellTypes, Coords } from "~/logic/types";
import { MATRIX_HEIGHT, MATRIX_WIDTH } from "~/logic/constant-params";

export class CellPointer {
    cell: Cell = new Cell();
    coords: Coords = {
        r: 0,
        c: 0
    }
    constructor(coords: Coords) {
        this.cell = new Cell();
        this.coords.r = coords.r;
        this.coords.c = coords.c;
    }
}

export interface TCell {
    type: CellTypes,
    isCellForRemoving: boolean,
    isCellInFigure: boolean,
    vLine: string | null,
    hLine: string | null,
    square: string | null,
    emergingBooster: Booster | null,
    booster: BoosterTypes | null,
}

export class Cell implements TCell {
    type = CellTypes.empty;
    isCellForRemoving = false;
    isCellInFigure = false;
    vLine = null;
    hLine = null;
    square = null;
    emergingBooster = null;
    booster = null;
}

type TMatrix<T> = T[][];



export class Matrix extends Array<CellPointer[]> {
    readonly height: number = 0;
    readonly width: number = 0;
    readonly lastRow: number = 0;
    readonly lastCol: number = 0;

    transposed: TMatrix<CellPointer> = [[new CellPointer({r: 0, c: 0})]];

    constructor(mHeight: number = MATRIX_HEIGHT, mWidth: number = MATRIX_WIDTH) {
        let matrix: TMatrix<CellPointer> = Array(mHeight).fill(Array(mWidth).fill(null))

        matrix = matrix.map(
            (row: CellPointer[], r: number) => row.map(
                (cell: CellPointer, c: number) => new CellPointer({r, c})
            )
        )

        super(...matrix)

        this.height = mHeight;
        this.width = mWidth;
        this.lastRow = mHeight - 1;
        this.lastCol = mWidth - 1;
        this.transposed = transposeMatrix(matrix, mWidth, mHeight);
    }

    eachRow(cb: (row: CellPointer[], index: number) => void) {
        for (let r = 0; r <= this.lastRow; r++) {
            cb(this[r], r)
        }
    }

    eachCol(cb: (col: CellPointer[], index: number) => void) {
        for (let c = 0; c <= this.lastCol; c++) {
            cb(this.transposed[c], c)
        }
    }

    eachCell(cb: (cPointer: CellPointer) => void) {
        for (let r = 0; r <= this.lastRow; r++) {
            for (let c = 0; c <= this.lastCol; c++) {
                cb(this[r][c]);
            }
        }
    }

    eachEmptyCell(cb: (cPointer: CellPointer) => void) {
        for (let r = 0; r <= this.lastRow; r++) {
            for (let c = 0; c <= this.lastCol; c++) {
                if (this[r][c].cell.type === 0) {
                    cb(this[r][c]);
                }
            }
        }
    }
}

function transposeMatrix(
    matrix: TMatrix<CellPointer>,
    width: number,
    height: number
): TMatrix<CellPointer> {
    let transposedMatrix: TMatrix<CellPointer> = Array(width).fill(Array(height))
    transposedMatrix = transposedMatrix.map(
        (col: CellPointer[], colIndex) => col.map(
            (cell: CellPointer, rowIndex) => new CellPointer({r: rowIndex, c: colIndex})
        )
    )
    for (let r = 0; r < height; r++) {
        for (let c = 0; c< width; c++) {
            transposedMatrix[c][r] = matrix[r][c]
        }
    }
    return transposedMatrix;
}

