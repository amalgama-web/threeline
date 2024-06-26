import { MATRIX_HEIGHT, MATRIX_WIDTH } from '../constant-params'
import { BoosterTypes, CellTypes, Coords, SwapCells, TMatrix, TypesCounter, TypesForShapes } from '../types'
import { CellPointer } from '../classes/CellPointer'
import { Cell } from '../classes/Cell'

export class Matrix extends Array<CellPointer[]> {
    readonly height: number = 0
    readonly width: number = 0
    readonly lastRow: number = 0
    readonly lastCol: number = 0

    readonly transposed: TMatrix<CellPointer>
    swappedCells: SwapCells | null = null

    selectedCell1: CellPointer | null = null
    selectedCell2: CellPointer | null = null

    constructor(mHeight: number = MATRIX_HEIGHT, mWidth: number = MATRIX_WIDTH) {
        let matrix: TMatrix<CellPointer> = Array(mHeight).fill(Array(mWidth).fill(null))

        matrix = matrix.map(
            (row: CellPointer[], r: number) => row.map(
                (cell: CellPointer, c: number) => new CellPointer({ r, c })
            )
        )

        super(...matrix as CellPointer[][])

        this.height = mHeight
        this.width = mWidth
        this.lastRow = mHeight - 1
        this.lastCol = mWidth - 1
        this.transposed = transposeMatrix(matrix, mWidth, mHeight)
    }

    getRow(rowIndex: number) {
        return this[rowIndex]
    }

    getCol(colIndex: number) {
        return this.transposed[colIndex]
    }

    eachCellInCol(colIndex: number, cb: (pointer: CellPointer) => void) {
        this.transposed[colIndex].forEach(cellPointer => {
            cb(cellPointer)
        })
    }

    eachCellInRow(rowIndex: number, cb: (pointer: CellPointer) => void) {
        this[rowIndex].forEach(cellPointer => {
            cb(cellPointer)
        })
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
                cb(this[r][c])
            }
        }
    }

    eachEmptyCell(cb: (cPointer: CellPointer) => void) {
        for (let r = 0; r <= this.lastRow; r++) {
            for (let c = 0; c <= this.lastCol; c++) {
                if (this[r][c].cell.type === 0) {
                    cb(this[r][c])
                }
            }
        }
    }

    /**
    * возвращает коллбеком все возможные пары ячеек, меняющихся местами
    * ислюкчаются случаи в которых хотя бы одна ячейка - бустер
    * */
    eachPossibleSwaps(cb: (swap: SwapCells) => void) {
        const swapOrientations: {
            rInc: 0 | 1,
            cInc: 0 | 1
        }[] = [
            {
                rInc: 0,
                cInc: 1
            },
            {
                rInc: 1,
                cInc: 0
            }
        ]

        this.eachCell(({ cell, coords: { r, c } }) => {

            if (cell.type === CellTypes.booster) return

            // todo education: найти инструмент анализа памяти для браузера (посмотреть сколько там занимает массивы и др)
            swapOrientations.forEach(({ rInc, cInc }) => {
                if (r + rInc > this.lastRow ||
                    c + cInc > this.lastCol ||
                    this[r + rInc][c + cInc].cell.type === CellTypes.booster
                ) return

                cb([{ r, c }, { r: r + rInc, c: c + cInc }])
            })
        })
    }

    isCoordsInside({ r, c }: Coords) {
        return r >= 0 && r <= this.lastRow && c >= 0 && c <= this.lastCol
    }

    swapCells(swap: SwapCells) {
        const [{ r: r1, c: c1 }, { r: r2, c: c2 }] = swap
        const tmpPointer = this[r1][c1].cell

        this[r1][c1].cell = this[r2][c2].cell
        this[r2][c2].cell = tmpPointer

        // todo common swap cells и просчет положения бустера
        this.swappedCells = swap
    }

    /** Очистка матрицы от данных рассчета фигур */
    reset() {
        this.eachCell(({ cell }) => {
            cell.isCellInShape = false
            cell.isCellForRemoving = false
            cell.hLine = null
            cell.vLine = null
            cell.square = null
            cell.emergingBooster = null
        })
    }

    resetShapesData() {
        this.eachCell(({ cell }) => {
            cell.hLine = null
            cell.vLine = null
            cell.square = null
        })
    }

    /** Полная очистка матрицы  */
    clear() {
        this.eachCell(cellPointer => {
            cellPointer.cell = new Cell()
        })
    }

    /**
     *  Проходим один раз по колонке снизу вверх и сдвигаем все вниз заполняя пустоты
     *  Перемещаем непустые ячейки вниз в строку currentRowIndexForFilling
     * */
    matrixGetDown() {
        this.eachCol((col) => {
            let currentRowIndexForFilling = this.lastRow

            for (let r = this.lastRow; r >= 0; r--) {
                if (col[r].cell.type === CellTypes.empty) continue

                if (r !== currentRowIndexForFilling) {
                    col[currentRowIndexForFilling].cell = col[r].cell
                    col[r].cell = new Cell()
                }

                currentRowIndexForFilling--
            }
        })
    }

    get typesCounters(): TypesCounter {
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
        })
        return typesCounter
    }

    get typesCountersExcludeRemovingCells(): TypesCounter {
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
            if (cellPointer.cell.isCellForRemoving) return
            typesCounter[cellPointer.cell.type]++
        })
        return typesCounter
    }

    get typeWithMaxCounter() {
        const typesCounters: TypesCounter = this.typesCountersExcludeRemovingCells
        let max = 0
        let maxType: CellTypes | null = null
        TypesForShapes.forEach(type => {
            if (typesCounters[type] > max) {
                max = typesCounters[type]
                maxType = type

            }
        })
        return maxType
    }

    get sunCounter() {
        let sum = 0
        this.eachCell(cellPointer => {
            if (cellPointer.cell.booster === BoosterTypes.sun) sum++
        })
        return sum
    }

    get totalPoints() {
        let sum = 0
        this.eachCell(cellPointer => {
            if (cellPointer.cell.isCellForRemoving &&
                TypesForShapes.includes(cellPointer.cell.type)
            ) sum++
        })
        return sum
    }

    get matrixToString() {
        let str = ''
        this.eachCell(({ cell }) => {
            str += cell.type
            if (cell.type === CellTypes.booster && cell.booster !== null) {
                str += cell.booster
            }
        })
        return str
    }

    get matrixToJSON() {
        return JSON.stringify(this)
    }


    static copy(matrix: Matrix) {
        const copy = new Matrix(matrix.height, matrix.width)
        // todo поэкспериментировать с копированием json и посмотреть что будет с классами и прототипами
        copy.eachCell(cellPointer => {
            const { r, c } = cellPointer.coords
            cellPointer.cell.type = matrix[r][c].cell.type
            cellPointer.cell.booster = matrix[r][c].cell.booster
        })

        return copy
    }

    static fromString(str: string): Matrix {
        const matrix = new Matrix()
        let pointer = 0
        matrix.eachCell(({ cell }) => {
            if (str[pointer] === undefined) return

            if (+str[pointer] === CellTypes.booster) {
                cell.type = CellTypes.booster
                cell.booster = +str[pointer + 1]
                pointer += 2
                return
            }
            cell.type = +str[pointer]
            pointer++
        })
        return matrix
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
    return transposedMatrix
}
