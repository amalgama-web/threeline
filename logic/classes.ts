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
    isCellInShape: boolean,
    vLine: string | null,
    hLine: string | null,
    square: string | null,
    emergingBooster: Booster | null,
    booster: BoosterTypes | null,
}

export class Cell implements TCell {
    type: CellTypes = CellTypes.empty;
    isCellForRemoving: boolean = false;
    isCellInShape: boolean = false;
    vLine: string | null = null;
    hLine: string | null = null;
    square: string | null = null;
    emergingBooster: Booster | null = null;
    booster: BoosterTypes | null = null;
}

type TMatrix<T> = T[][];

export type TypesCounter = {
    [type in CellTypes]: number
}


export class Matrix extends Array<CellPointer[]> {
    readonly height: number = 0;
    readonly width: number = 0;
    readonly lastRow: number = 0;
    readonly lastCol: number = 0;

    readonly transposed: TMatrix<CellPointer>;

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

    get counters() {
        const typesCounter: TypesCounter = {
            [CellTypes.empty]: 0,
            [CellTypes.yellow]: 0,
            [CellTypes.red]: 0,
            [CellTypes.blue]: 0,
            [CellTypes.pink]: 0,
            [CellTypes.purple]: 0,
            [CellTypes.booster]: 0,
        }
        this.eachCell(cellPointer => {
            typesCounter[cellPointer.cell.type]++
        });
        return typesCounter;
    }

    get sunCounter() {
        let sum = 0;
        this.eachCell(cellPointer => {
            if (cellPointer.cell.booster === BoosterTypes.sun) sum++;
        });
        return sum;
    }

    get totalPoints() {
        let sum = 0;
        this.eachCell(cellPointer => {
            if (cellPointer.cell.isCellForRemoving) sum++;
        });
        return sum;
    }

    isCoordsInside({ r, c }: Coords) {
        return r >= 0 && r <= this.lastRow && c >= 0 && c <= this.lastCol;
    }

    static copy(originalMatrix: Matrix) {
        const copy = new Matrix();
        copy.eachCell(cellPointer => {
            const {r, c} = cellPointer.coords;
            cellPointer.cell = JSON.parse(JSON.stringify(originalMatrix[r][c].cell))
        })
        return copy;
    }
}

function transposeMatrix(
    matrix: TMatrix<CellPointer>,
    width: number,
    height: number
): TMatrix<CellPointer> {
    let transposedMatrix: TMatrix<CellPointer> = Array(width).fill(Array(height))
    // todo поэкспериментировать с Array и созданием массивов
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

