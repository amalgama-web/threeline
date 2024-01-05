import { findHLines, findVLines } from '~/logic/highlighting/find-lines';
import { findSquare } from '~/logic/highlighting/find-square';
import { createBoostersForHLines, createBoostersForVLines } from '~/logic/boosters/lines-boosters';
import { createBoostersForSquares } from '~/logic/boosters/square-boosters';
import {
    markHLinesInMatrix,
    markSquaresInMatrix,
    markVLinesInMatrix
} from '~/logic/highlighting/mark-figures-in-matrix';
import { mergeLinesAndSquares, mergeLinesAndSun, mergeSquaresAndSun } from '~/logic/highlighting/merge-figures';
import { markEmergingBoostersInMatrix } from '~/logic/highlighting/mark-boosters-in-matrix';
import {
    markDeletedForOrdinaryLines,
    markDeletedForSquares,
    markDeletedForSun
} from '~/logic/highlighting/mark-cell-for-removing';
import { Lines, SwapCells, Squares } from '~/logic/types';
import { CellPointer } from '~/logic/classes/cellPointer';
import { Matrix } from '~/logic/classes/matrix';


export function highlightShapes(matrix: Matrix, stepSwapCells: SwapCells | null = null) {
    // находим фигуры (линии и квадраты) из ячеек одного типа
    const hLines: Lines = findHLines(matrix)
    const vLines: Lines = findVLines(matrix)
    const squares: Squares = findSquare(matrix)

    // создаем бустеры в фигурах (линий длиннее 3 и квадратов) с учетом свапнутых ячеек
    createBoostersForHLines(hLines, stepSwapCells)
    createBoostersForVLines(vLines, stepSwapCells)
    createBoostersForSquares(squares, stepSwapCells)

    // отмечаем для каждой ячейки в матрице ее принадлежность к фигуре (vLine, hLine или square)
    markHLinesInMatrix(matrix, hLines)
    markVLinesInMatrix(matrix, vLines)
    markSquaresInMatrix(matrix, squares)

    // разруливаем пересекающиеся фигуры и отмечаем менее весомые как disabled
    // например если линия из 3х пересекает квадрат - отсавляем квадрат, а линия из 4 весомей квадрата
    // todo названия более подходящие найти
    mergeLinesAndSun(matrix, hLines, vLines)
    mergeSquaresAndSun(matrix, squares, vLines, hLines)
    mergeLinesAndSquares(matrix, hLines, vLines, squares)

    // для оставшихся не помеченных disabled фигур (lines и squares) отмечаем ячейки матрицы в которых появится booster
    markEmergingBoostersInMatrix(matrix, hLines, vLines, squares)

    // все ячейки входящие в какую либо фигуру выделяются параметром highlighted
    highlightCells(matrix)

    markDeletedForOrdinaryLines(matrix, hLines, vLines)
    markDeletedForSun(matrix)
    markDeletedForSquares(matrix, squares)
}


function highlightCells(matrix: Matrix) {
    matrix.eachCell((cellPointer: CellPointer) => {
        const cell = cellPointer.cell
        if (cell.vLine || cell.hLine || cell.square) {
            cell.isCellInShape = true;
        }
    })
}
