// todo возможно сделать класс matrix
import { Cell, CellTypes, Coords, ZeroCell } from "~/logic/types";
import { MATRIX_HEIGHT, MATRIX_LAST_COL, MATRIX_LAST_ROW, MATRIX_WIDTH } from "~/logic/constant-params";

export class ArrayExtended extends Array {

    eachCell(cb: (cell: Cell, coords: Coords) => void) {
        for (let r = 0; r <= MATRIX_LAST_ROW; r++) {
            for (let c = 0; c <= MATRIX_LAST_COL; c++) {
                cb(this[r][c], {r, c})
            }
        }
    }

    eachRow(cb: Function) {
        for (let r = 0; r <= MATRIX_LAST_ROW; r++) {
            cb(this[r], r)
        }
    }

    // todo покумекать тут, может ф генераторы попробовать
    eachCol(cb: Function) {

    }

    eachEmptyCell(cb: (cell: Cell, coords: Coords) => void) {
        for (let r = 0; r <= MATRIX_LAST_ROW; r++) {
            for (let c = 0; c <= MATRIX_LAST_COL; c++) {
                if (this[r][c].type === CellTypes.empty) {
                    cb(this[r][c], {r, c})
                }
            }
        }
    }

    static create(matrixHeight: number, matrixWidth: number) {
        return new ArrayExtended(matrixHeight).fill(Array(matrixWidth).fill(new ZeroCell()));
    }
}


const matrix = ArrayExtended.create(MATRIX_HEIGHT, MATRIX_WIDTH);
console.log(matrix)
matrix.eachCell((cell: Cell) => {
    console.log(cell)
})
matrix.eachRow( (row: Cell[]) => {
    console.log(row)
})