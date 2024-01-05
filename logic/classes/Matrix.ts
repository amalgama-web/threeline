import { MATRIX_HEIGHT, MATRIX_WIDTH } from '~/logic/constant-params';
import { BoosterTypes, CellTypes, Coords, SwapCells, TMatrix } from '~/logic/types';
import { TypesCounter } from '~/logic/types';
import { CellPointer } from '~/logic/classes/CellPointer';
import { Cell } from '~/logic/classes/Cell';

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
                (cell: CellPointer, c: number) => new CellPointer({ r, c })
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

    isCoordsInside({ r, c }: Coords) {
        return r >= 0 && r <= this.lastRow && c >= 0 && c <= this.lastCol;
    }

    swapCells(swap: SwapCells) {
        const [{ r: r1, c: c1 }, { r: r2, c: c2 }] = swap;
        const tmpPointer = this[r1][c1].cell

        this[r1][c1].cell = this[r2][c2].cell
        this[r2][c2].cell = tmpPointer
    }

    reset() {
        this.eachCell(({ cell }) => {
            cell.isCellInShape = false;
            cell.isCellForRemoving = false;
            cell.hLine = null;
            cell.vLine = null;
            cell.square = null;
            cell.emergingBooster = null;
        })
    }

    clear() {
        this.eachCell(cellPointer => {
            cellPointer.cell = new Cell();
        })
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

    static copy(originalMatrix: Matrix) {
        const copy = new Matrix();
        // todo копировать все параметры а не только ячейки
        // todo поэкспериментировать с копированием json и посмотреть что будет с классами и прототипами
        copy.eachCell(cellPointer => {
            const { r, c } = cellPointer.coords;
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
            (cell: CellPointer, rowIndex) => new CellPointer({ r: rowIndex, c: colIndex })
        )
    )
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            transposedMatrix[c][r] = matrix[r][c]
        }
    }
    return transposedMatrix;
}
