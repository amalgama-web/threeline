import { Matrix } from './classes/Matrix';
import { Cell } from './classes/Cell'
import { BoostersActions, BoosterTypes, CellTypes, Coords, snowflakeRays } from './types';
import { gameDelay, makeIterationAndGetPoints } from './game';
import { cutShapesAndSetBoosters } from './cut/cut-shapes-and-set-boosters';
import { matrixGetDown } from './matrix-get-down';
import { fillMatrix } from './matrix-fill';
import { activateBoosters } from './boosters/activate-boosters';

export async function applyBooster(matrix: Matrix, { r, c }: Coords) {

    const type = matrix[r][c].cell.booster;
    if (type === null) return;
    activateBoosters(matrix, [{
        type,
        coords: { r, c }
    }])

    // todo это подобная get points from step iteration
    let points = matrix.totalPoints;

    await gameDelay()
    cutShapesAndSetBoosters(matrix)
    matrix.reset()
    await gameDelay()
    matrixGetDown(matrix);
    await gameDelay()
    fillMatrix(matrix)
    await gameDelay()

    const additionPoints = await makeIterationAndGetPoints(matrix);

    points += additionPoints;
}


