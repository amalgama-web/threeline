import { Matrix } from '~/logic/classes/Matrix';
import { SwapCells } from '~/logic/types';
import { highlightShapes } from '~/logic/highlighting/highlight-shapes';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { matrixGetDown } from '~/logic/matrix-get-down';

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
