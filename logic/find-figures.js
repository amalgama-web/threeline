import { MATRIX_WIDTH, MATRIX_HEIGHT } from '~/logic/constant-params';
import { CellTypes } from '~/logic/types';


export const zeroCell = {
    type: null,
    highlighted: false,
    forRemoving: false,
    vLine: null,
    hLine: null,
    square: null,
    emergingBooster: null,
    booster: null,
}

export function getZeroCell() {
    return JSON.parse(JSON.stringify(zeroCell))
}

export const typeColors = [
    '#eabd29',
    '#ce1f1f',
    '#4455ff',
    '#ef77ff',
    '#8500b6',
    '#000',
]

export const colorTypePairs = {
    'ж': 0,
    'к': 1,
    'с': 2,
    'р': 3,
    'ф': 4,
    'ч': 5,
    '1': 5,
    '2': 5,
    '3': 5,
    '4': 5,
    ';': 0,
    'r': 1,
    'c': 2,
    'h': 3,
    'a': 4,
    'x': 5,
}
export const colorTypePairsRevert = {
    0: 'ж',
    1: 'к',
    2: 'с',
    3: 'р',
    4: 'ф',
    5: 'ч',
}

export const imageTypePairs = {
    0: 'coin',
    1: 'case',
    2: 'wallet',
    3: 'pig',
    4: 'hourglass',
}


export function applyCombinations(matrix) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.forRemoving === true) {
                cell.type = null;
            }
            if (cell.emergingBooster) {
                // todo прописать поточнее типы для ячеек
                cell.type = CellTypes.booster;
                cell.booster = cell.emergingBooster.type
            }
        })
    })
}



export function showVariantsWithSun(variants) {
    variants.forEach(variant => {
        variant.hasSun = findSun(variant)
    })

    return variants;
}

function findSun(variant) {
    return variant.variantHasSun || (variant.stepsAfter ? findSunInArr(variant.stepsAfter) : false)
}

function findSunInArr(variantsArr) {
    variantsArr.forEach(variant => {
        variant.hasSun = findSun(variant)
    })
    return variantsArr.some(variant => variant.hasSun)
}

export function resetMatrix(matrix) {
    matrix.forEach(row => {
        row.forEach(cell => {
            cell.highlighted = false;
            cell.forRemoving = false;
            cell.hLine = null;
            cell.vLine = null;
            cell.square = null;
            cell.emergingBooster = null;
        })
    })
}


export function applyCellsSwap(grid, swap) {
    let tmpCell = grid[swap[0].r][swap[0].c]
    grid[swap[0].r][swap[0].c] = grid[swap[1].r][swap[1].c]
    grid[swap[1].r][swap[1].c] = tmpCell
}

export function gridGetDown(matrix) {
    for (let r = 0; r < MATRIX_HEIGHT; r++) {
        for (let c = 0; c < MATRIX_WIDTH; c++) {
            if (matrix[r][c].type === null) {
                downColumn(matrix, r, c)
            }
        }
    }
}

function downColumn(grid, row, col) {
    for (let r = row; r > 0; r--) {
        grid[r][col].type = grid[r - 1][col].type;
        grid[r][col].booster = grid[r - 1][col].booster;
    }
    grid[0][col].type = null
    grid[0][col].booster = null
}


export function highlightCells(matrix) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.vLine || cell.hLine || cell.square) {
                cell.highlighted = true;
            }
        })
    })
}



