import { BoostersActions, BoosterTypes, CellTypes, Coords, snowflakeRays } from '../types';
import { Matrix } from '../classes/Matrix';
import { Cell } from '../classes/Cell';
import activateVRocket from './activate-vRocket';
import activateHRocket from './activate-hRocket';
import activateSun from './activate-sun';
import activateSnowflake from './activate-snowflake';

type AffectedBooster = {
    type: BoosterTypes,
    coords: Coords
};


// todo переделать на просто координаты без type
export function activateBoosters(matrix: Matrix, boosters: AffectedBooster[] = []) {
    console.log('activateBoosters', boosters)
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
     * это бустеры активированные бустерами текущей итерации
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
     * Если нашлись активированные бустеры - передаем их в следующую итерацию
     * */
    if (affectedBoosters.length) {
        activateBoosters(matrix, affectedBoosters)
    }
}


/**
 * actions для каждого типа бустера
 * */
const boostersActions: BoostersActions = {
    [BoosterTypes.vRocket]: activateVRocket,

    [BoosterTypes.hRocket]: activateHRocket,

    [BoosterTypes.sun]: activateSun,

    [BoosterTypes.snowflake]: activateSnowflake,
}