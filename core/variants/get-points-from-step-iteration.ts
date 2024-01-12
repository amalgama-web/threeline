import { Matrix } from '../classes/Matrix';
import { SwapCells } from '../types';
import { highlightShapes } from '../highlighting/highlight-shapes';
import { cutShapesAndSetBoosters } from '../cut/cut-shapes-and-set-boosters';

export function getPointsFromStepIteration(matrix: Matrix, swap: SwapCells | null = null): number {
    highlightShapes(matrix, swap);

    let points = matrix.totalPoints;

    if (points === 0) {
        matrix.reset();
        return 0
    }

    cutShapesAndSetBoosters(matrix)

    matrix.reset();

    matrix.matrixGetDown();

    return points + getPointsFromStepIteration(matrix)
}
