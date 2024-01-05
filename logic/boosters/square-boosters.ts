import { Booster, BoosterTypes, Coords, Squares, SwapCells, Square } from '~/logic/types';

export function createBoostersForSquares(squares: Squares, stepSwapCells: SwapCells | null) {
    for (let squareID in squares) {
        const booster: Booster = {
            type: BoosterTypes.snowflake,
            coords: { r: 0, c: 0 }
        }

        if (stepSwapCells && checkCellInSquare(stepSwapCells[0], squares[squareID])) {
            booster.coords = stepSwapCells[0]
        } else if (stepSwapCells && checkCellInSquare(stepSwapCells[1], squares[squareID])) {
            booster.coords = stepSwapCells[1]
        } else {
            booster.coords = {
                r: squares[squareID].coords.r,
                c: squares[squareID].coords.c
            }
        }
        squares[squareID].booster = booster
    }
}

function checkCellInSquare(cellCoords: Coords, square: Square) {
    return cellCoords.r >= square.coords.r &&
        cellCoords.r < square.coords.r + 2 &&
        cellCoords.c >= square.coords.c &&
        cellCoords.c < square.coords.c + 2
}
