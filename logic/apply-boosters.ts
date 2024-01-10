import { Matrix } from '~/logic/classes/Matrix';
import { BoosterTypes, Coords } from '~/logic/types';
import { gameDelay } from '~/logic/game';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { matrixGetDown } from '~/logic/matrix-get-down';
import { fillMatrix } from '~/logic/matrix-fill';
import { makeIterationAndGetPoints } from '~/logic/game';

export async function applyBooster(matrix: Matrix, { r, c }: Coords) {
    const booster = matrix[r][c].cell.booster;
    if (booster === null) return;

    boostersActions[BoosterTypes[booster]](matrix, { r, c });
    let points = matrix.totalPoints;

    await gameDelay()
    cutFiguresAndSetBoosters(matrix)
    matrix.reset()
    await gameDelay()
    matrixGetDown(matrix);
    await gameDelay()
    fillMatrix(matrix)
    await gameDelay()

    const additionPoints = await makeIterationAndGetPoints(matrix);

    points += additionPoints;
    console.log(points)
}

/*
* todo возникает необходимость разделить forRemoving и pointsCell так как для бустера его надо удалять
* todo но в итоговые очки его не включаем
* */
const boostersActions = {
    [BoosterTypes[BoosterTypes.vRocket]](matrix: Matrix, { r, c }: Coords) {
        matrix.eachCellInCol(c, (cellPointer) => {
            console.log(cellPointer)
            cellPointer.cell.isCellForRemoving = true;
            if (cellPointer.cell.booster && !cellPointer.cell.isCellForRemoving) {
                applyBooster(matrix, cellPointer.coords)
            }
        })
    },
    [BoosterTypes[BoosterTypes.hRocket]]() {
        console.log('hRocket')
    },
    [BoosterTypes[BoosterTypes.sun]]() {
        console.log('sun')
    },
    [BoosterTypes[BoosterTypes.snowflake]]() {
        console.log('sun')
    }
}