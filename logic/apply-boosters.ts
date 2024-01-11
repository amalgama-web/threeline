import { Matrix } from '~/logic/classes/Matrix';
import { Cell } from '~/logic/classes/Cell'
import { BoostersActions, BoosterTypes, CellTypes, Coords, snowflakeRays } from '~/logic/types';
import { gameDelay, makeIterationAndGetPoints } from '~/logic/game';
import { cutFiguresAndSetBoosters } from '~/logic/cut/cut-figures';
import { matrixGetDown } from '~/logic/matrix-get-down';
import { fillMatrix } from '~/logic/matrix-fill';

export async function applyBooster(matrix: Matrix, { r, c }: Coords) {

    const type = matrix[r][c].cell.booster;
    if (type === null) return;
    activateBoosters(matrix, [{
        type,
        coords: { r, c }
    }])

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

type AffectedBooster = {
    type: BoosterTypes,
    coords: Coords
};

function activateBoosters(matrix: Matrix, boosters: AffectedBooster[]) {
    /**
     * Сортируем бустеры текущей итерации - sun должно быть первым,
     * так как подсчет количества типов ячеек должен произойти
     * до применения остальных бустеров текущей итерации
     * */
    boosters.sort((bst1, bst2) => {
        return bst1.type === BoosterTypes.sun ? -1 : 1;
    })

    /**
     * Удаляем бустеры текущей итерации с поля
     * и для каждого вызываем фукнцию action по типу бустера
     * в этих функциях лишь помечаем ячейки на удаление без непосредственно удаления
     * */
    boosters.forEach(({ type, coords: { r, c } }) => {
        matrix[r][c].cell = new Cell();
        matrix[r][c].cell.isCellForRemoving = true;
        boostersActions[type](matrix, { r, c })
    })

    /**
     * Проходим по матрице и находим бустеры помеченные на удаление -
     * это бустеры зацепленные бустерами текущей итерации
     * */
    const affectedBoosters: AffectedBooster[] = [];

    matrix.eachCell(({ cell, coords }) => {
        if (!cell.isCellForRemoving ||
            cell.type !== CellTypes.booster ||
            cell.booster === null) return;

        affectedBoosters.push({
            type: cell.booster,
            coords: coords
        })
    })

    /**
     * Если нашлись зацепленные бустеры - передаем их в следующую итерацию
     * */
    if (affectedBoosters.length) {
        activateBoosters(matrix, affectedBoosters)
    }
}


/**
 * actions для каждого типа бустера
 * */
const boostersActions: BoostersActions = {
    [BoosterTypes.vRocket](matrix: Matrix, { r, c }: Coords) {
        matrix.eachCellInCol(c, ({ cell }) => {
            cell.isCellForRemoving = true;
        })
    },

    [BoosterTypes.hRocket](matrix: Matrix, { r, c }: Coords) {
        matrix.eachCellInRow(r, ({ cell }) => {
            cell.isCellForRemoving = true;
        })
    },

    [BoosterTypes.sun](matrix: Matrix, coords: Coords) {
        const maxType = matrix.typeWithMaxCounter

        matrix.eachCell(({ cell }) => {
            if (cell.type !== maxType) return;
            cell.isCellForRemoving = true;
        })
    },

    [BoosterTypes.snowflake](matrix: Matrix, { r, c }: Coords) {
        snowflakeRays.forEach(({ rInc, cInc }) => {
            const row = r + rInc
            const col = c + cInc

            if (!matrix.isCoordsInside({ r: row, c: col })) return;

            matrix[row][col].cell.isCellForRemoving = true;
        })
    }
}