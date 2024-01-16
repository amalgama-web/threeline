import { CellPointer } from './classes/CellPointer';
import { Matrix } from './classes/Matrix';
import { BoosterTypes, Coords, SwapCells } from './types';
import { highlightShapes } from './highlighting/highlight-shapes';
import { cutShapesAndSetBoosters } from './cut/cut-shapes-and-set-boosters';
import { fillMatrix } from './matrix-fill';

export function cellClick(matrix: Matrix, cellPointer: CellPointer) {
    if (matrix.selectedCell1 !== null) {
        if (isNeighbours(matrix.selectedCell1, cellPointer)) {
            return setSelectedCell2(matrix, cellPointer)
        } else {
            setSelectedCell1(matrix, cellPointer)
            return false;
        }
    } else {
        setSelectedCell1(matrix, cellPointer)
        return false;
    }
}

function isNeighbours(cellPointer1: CellPointer, cellPointer2: CellPointer) {
    const { r: r1, c: c1 } = cellPointer1.coords;
    const { r: r2, c: c2 } = cellPointer2.coords;
    return Math.abs(r1 - r2) === 1 && c1 === c2 ||
        Math.abs(c1 - c2) === 1 && r1 === r2

}

function setSelectedCell1(matrix: Matrix, cellPointer: CellPointer | null) {
    if (cellPointer === null) {
        if (matrix.selectedCell1 !== null) {
            matrix.selectedCell1.cell.isCellSelected = false;
            matrix.selectedCell1 = null;
        }
        return;
    }
    if (matrix.selectedCell1) {
        matrix.selectedCell1.cell.isCellSelected = false;
    }
    matrix.selectedCell1 = cellPointer;
    cellPointer.cell.isCellSelected = true;

    setSelectedCell2(matrix, null)
}

function setSelectedCell2(matrix: Matrix, cellPointer: CellPointer | null) {
    if (cellPointer === null) {
        if (matrix.selectedCell2 !== null) {
            matrix.selectedCell2.cell.isCellSelected = false;
            matrix.selectedCell2 = null;
        }
        return;
    }
    if (matrix.selectedCell2) {
        matrix.selectedCell2.cell.isCellSelected = false;
    }
    matrix.selectedCell2 = cellPointer;
    cellPointer.cell.isCellSelected = true;

    const swap: SwapCells = [matrix.selectedCell1!.coords, matrix.selectedCell2.coords];
    if (checkIsSwapWithPoints(matrix, swap)) {
        // makeFullStep(matrix, swap);
        return true;
    } else {
        return false;
        setSelectedCell1(matrix, null)
        setSelectedCell2(matrix, null)
    }
}

function checkIsSwapWithPoints(matrix: Matrix, swap: SwapCells) {
    const variationMatrix = Matrix.copy(matrix);
    variationMatrix.swapCells(swap);
    highlightShapes(variationMatrix);
    return variationMatrix.totalPoints;
}

async function makeFullStep(matrix: Matrix, swap: SwapCells) {
    matrix.swapCells(swap);
    resetSelectedCells(matrix)
    await gameDelay()

    const points = await makeIterationAndGetPoints(matrix, swap)
    console.log(points)

}

function resetSelectedCells(matrix: Matrix) {
    setSelectedCell1(matrix, null)
    setSelectedCell2(matrix, null)
}

export async function makeIterationAndGetPoints(matrix: Matrix, swap: SwapCells | null = null): Promise<number> {
    highlightShapes(matrix, swap)
    const points = matrix.totalPoints;
    if (points === 0) {
        matrix.reset()
        return 0;
    }

    await gameDelay()
    cutShapesAndSetBoosters(matrix)
    matrix.reset()
    await gameDelay()
    matrix.matrixGetDown();
    await gameDelay()
    fillMatrix(matrix)
    await gameDelay()

    return points + await makeIterationAndGetPoints(matrix);
}

export async function gameDelay(delay: number = 300) {
    return new Promise(r => setTimeout(r, delay))
}


