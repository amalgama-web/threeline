import { BoosterTypes, CellTypes } from './types';

export const symbolTypePairs = {
    'ж': CellTypes.yellow,
    'к': CellTypes.red,
    'с': CellTypes.blue,
    'р': CellTypes.pink,
    'ф': CellTypes.purple,
    'ч': CellTypes.booster,

    ';': CellTypes.yellow,
    'r': CellTypes.red,
    'c': CellTypes.blue,
    'h': CellTypes.pink,
    'a': CellTypes.purple,
    'x': CellTypes.booster,

    '1': CellTypes.booster,
    '2': CellTypes.booster,
    '3': CellTypes.booster,
    '4': CellTypes.booster,

}
export const symbolTypePairsRevert = {
    [CellTypes.yellow]: 'ж',
    [CellTypes.red]: 'к',
    [CellTypes.blue]: 'с',
    [CellTypes.pink]: 'р',
    [CellTypes.purple]: 'ф',
    [CellTypes.booster]: 'ч',
}