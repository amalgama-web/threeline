import { Booster, BoosterTypes, CellTypes, Coords } from "~/logic/types";
import { MATRIX_HEIGHT, MATRIX_WIDTH } from "~/logic/constant-params";

class CellPointer {
    cell: Cell | null = null;
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

class Matrix extends Array {
    height: number = 0;
    width: number = 0;
    lastRow: number = 0;
    lastCol: number = 0;

    transposed: TMatrix<CellPointer> | TMatrix<null> = [[null]];

    eachRow(cb: (cell: CellPointer[]) => void) {
        for (let r = 0; r <= this.lastRow; r++) {
            cb(this[r])
        }
    }

    eachCol(cb: (col: CellPointer[] | null[]) => void) {
        for (let c = 0; c <= this.lastCol; c++) {
            // todo
            cb(this.transposed[c])
        }
    }

    eachCell(cb: (cell: CellPointer) => void) {
        for (let r = 0; r <= this.lastRow; r++) {
            for (let c = 0; c <= this.lastCol; c++) {
                cb(this[r][c]);
            }
        }
    }

    eachEmptyCell(cb: (cell: CellPointer) => void) {
        for (let r = 0; r <= this.lastRow; r++) {
            for (let c = 0; c <= this.lastCol; c++) {
                if (this[r][c].cell.type === 0) {
                    cb(this[r][c]);
                }
            }
        }
    }
}

// todo вынести в декоратор
class MatrixCreator {
    constructor(mHeight: number = MATRIX_HEIGHT, mWidth: number = MATRIX_WIDTH) {
        let matrix = new Matrix(mHeight).fill(Array(mWidth).fill(null))
        // todo
        matrix = matrix.map(
            (row: CellPointer[], r: number) => row.map(
                (cell: CellPointer, c: number) => new CellPointer({r, c})
            )
        ) as Matrix

        matrix.height = mHeight;
        matrix.width = mWidth;
        matrix.lastRow = mHeight - 1;
        matrix.lastCol = mWidth - 1;

        matrix.transposed = transposeMatrix(matrix);
        return matrix;
    }
}


function transposeMatrix(matrix: Matrix): TMatrix<CellPointer> | TMatrix<null> {
    let transposedMatrix: TMatrix<CellPointer> | TMatrix<null> = Array(matrix.width).fill(Array(matrix.height))
    transposedMatrix = transposedMatrix.map(
        (col: (CellPointer | null)[]) => col.map(
            (cell: CellPointer | null) => null
        )
    )
    for (let r = 0; r <= matrix.lastRow; r++) {
        for (let c = 0; c<= matrix.lastCol; c++) {
            transposedMatrix[c][r] = matrix[r][c]
        }
    }
    return transposedMatrix;
}

export const matrix = new MatrixCreator();