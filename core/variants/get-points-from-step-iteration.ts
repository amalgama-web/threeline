import { Matrix } from '../classes/Matrix';
import { SwapCells } from '../types';
import { highlightShapes } from '../highlighting/highlight-shapes';
import { cutFiguresAndSetBoosters } from '../cut/cut-figures';
import { matrixGetDown } from '../matrix-get-down';

export function getPointsFromStepIteration(matrix: Matrix, swap: SwapCells | null = null): number {
    highlightShapes(matrix, swap);

    let points = matrix.totalPoints;

    if (points === 0) {
        matrix.reset();
        return 0
    }

    cutFiguresAndSetBoosters(matrix)

    matrix.reset();

    matrixGetDown(matrix);

    return points + getPointsFromStepIteration(matrix)
}
