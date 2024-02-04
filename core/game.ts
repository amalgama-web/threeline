import { CellPointer } from './classes/CellPointer'
import { Matrix } from './classes/Matrix'
import { BoosterTypes, Coords, SwapCells } from './types'
import { highlightShapes } from './highlighting/highlight-shapes'
import { cutShapesAndSetBoosters } from './cut/cut-shapes-and-set-boosters'
import { fillMatrix } from './matrix-fill'
import { delay } from '@/utils/main'

/**
 * @return boolean=true - если перемещение ячеек приводит к появлению фигур
 * @return boolean=false - в противном случае
 * */
export function cellClick(matrix: Matrix, cellPointer: CellPointer) {
  if (matrix.selectedCell1 !== null) {
    if (isNeighbours(matrix.selectedCell1, cellPointer)) {
      return setSelectedCell2(matrix, cellPointer)
    } else {
      setSelectedCell1(matrix, cellPointer)
      return false
    }
  } else {
    setSelectedCell1(matrix, cellPointer)
    return false
  }
}

/** Являются ли ячейки соседними */
function isNeighbours(cellPointer1: CellPointer, cellPointer2: CellPointer) {
  const { r: r1, c: c1 } = cellPointer1.coords
  const { r: r2, c: c2 } = cellPointer2.coords
  return Math.abs(r1 - r2) === 1 && c1 === c2 ||
    Math.abs(c1 - c2) === 1 && r1 === r2
}


function setSelectedCell1(matrix: Matrix, cellPointer: CellPointer) {
  if (matrix.selectedCell1) {
    resetSelectedCell1(matrix)
  }

  applySelectedCell1(matrix, cellPointer)
  resetSelectedCell2(matrix)
}

/** @return swap - если применение этой ячейки приводит к фигуре
 *  @return false - если не приводит к фигуре
 * */
function setSelectedCell2(matrix: Matrix, cellPointer: CellPointer) {
  if (matrix.selectedCell2 !== null) {
    resetSelectedCell2(matrix)
  }

  applySelectedCell2(matrix, cellPointer)

  const swap: SwapCells = [matrix.selectedCell1!.coords, matrix.selectedCell2!.coords]
  if (checkIsSwapWithPoints(matrix, swap)) {
    return swap
  } else {
    resetSelectedCell1(matrix)
    resetSelectedCell2(matrix)
    return false
  }
}


function applySelectedCell1(matrix: Matrix, cellPointer: CellPointer) {
  matrix.selectedCell1 = cellPointer
  cellPointer.cell.isCellSelected = true
}
function resetSelectedCell1(matrix: Matrix) {
  if (matrix.selectedCell1 !== null) {
    matrix.selectedCell1.cell.isCellSelected = false
    matrix.selectedCell1 = null
  }
}
function resetSelectedCell2(matrix: Matrix) {
  if (matrix.selectedCell2 !== null) {
    matrix.selectedCell2.cell.isCellSelected = false
    matrix.selectedCell2 = null
  }
}
function applySelectedCell2(matrix: Matrix, cellPointer: CellPointer) {
  matrix.selectedCell2 = cellPointer
  cellPointer.cell.isCellSelected = true
}

function checkIsSwapWithPoints(matrix: Matrix, swap: SwapCells) {
  const variationMatrix = Matrix.copy(matrix)
  variationMatrix.swapCells(swap)
  highlightShapes(variationMatrix)
  return !!variationMatrix.totalPoints
}

export async function makeFullStep(matrix: Matrix, swap: SwapCells) {
  matrix.swapCells(swap)
  resetSelectedCells(matrix)
  await delay()

  return await makeIterationAndGetPoints(matrix, swap)
}

function resetSelectedCells(matrix: Matrix) {
  resetSelectedCell1(matrix)
  resetSelectedCell2(matrix)
}

export async function makeIterationAndGetPoints(matrix: Matrix, swap: SwapCells | null = null): Promise<number> {
  highlightShapes(matrix, swap)
  const points = matrix.totalPoints
  if (points === 0) {
    matrix.reset()
    return 0
  }

  await delay()
  cutShapesAndSetBoosters(matrix)
  matrix.reset()
  await delay()
  matrix.matrixGetDown()
  await delay()
  fillMatrix(matrix)
  await delay()

  return points + await makeIterationAndGetPoints(matrix)
}



