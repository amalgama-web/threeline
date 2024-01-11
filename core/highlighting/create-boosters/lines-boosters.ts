import { Booster, BoosterTypes, Coords, Line, Lines, SwapCells } from '../../types';


export function createBoostersForHLines(hLines: Lines, stepSwapCells: SwapCells | null) {
    for (let hLineID in hLines) {

        let booster: Booster | null = null;

        if (hLines[hLineID].length >= 4) {
            booster = {
                type: BoosterTypes.hRocket,
                coords: { r: 0, c: 0 }
            }
            if (hLines[hLineID].length > 4) {
                booster.type = BoosterTypes.sun
            }
        }

        if (booster) {
            if (stepSwapCells && checkCellInHLine(stepSwapCells[0], hLines[hLineID])) {
                booster.coords = stepSwapCells[0]
            } else if (stepSwapCells && checkCellInHLine(stepSwapCells[1], hLines[hLineID])) {
                booster.coords = stepSwapCells[1]
            } else {
                booster.coords = {
                    r: hLines[hLineID].coords.r,
                    c: hLines[hLineID].coords.c - hLines[hLineID].length + 1
                }
            }
            hLines[hLineID].booster = booster
        }
    }
}

export function createBoostersForVLines(vLines: Lines, stepSwapCells: SwapCells | null) {
    for (let vLineID in vLines) {

        let booster: Booster | null = null;

        if (vLines[vLineID].length >= 4) {
            booster = {
                type: BoosterTypes.vRocket,
                coords: { r: 0, c: 0 }
            }
            if (vLines[vLineID].length > 4) {
                booster.type = BoosterTypes.sun
            }
        }
        if (booster) {
            if (stepSwapCells && checkCellInVLine(stepSwapCells[0], vLines[vLineID])) {
                booster.coords = stepSwapCells[0]
            } else if (stepSwapCells && checkCellInVLine(stepSwapCells[1], vLines[vLineID])) {
                booster.coords = stepSwapCells[1]
            } else {
                booster.coords = {
                    r: vLines[vLineID].coords.r - vLines[vLineID].length + 1,
                    c: vLines[vLineID].coords.c
                }
            }
            vLines[vLineID].booster = booster
        }
    }
}


function checkCellInHLine(cellCoords: Coords, line: Line) {
    return cellCoords.r === line.coords.r && cellCoords.c <= line.coords.c && cellCoords.c > line.coords.c - line.length;
}

function checkCellInVLine(cellCoords: Coords, line: Line) {
    return cellCoords.c === line.coords.c && cellCoords.r <= line.coords.r && cellCoords.r > line.coords.r - line.length;
}
