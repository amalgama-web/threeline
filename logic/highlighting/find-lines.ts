import { CellTypes, Line, Lines, TypesForShapes } from '~/logic/types';
import { Matrix } from '~/logic/classes/matrix';

export function findHLines(matrix: Matrix): Lines {
    let foundLines: Lines = {};
    let currentLineId: number = 1;

    matrix.eachRow( (row, r) => {
        let curType: CellTypes | null = null;
        let lineLength: number = 1;
        let foundLine: Line | null = null;

        for (let c = 0; c <= matrix.lastCol; c++) {

            if (curType === row[c].cell.type &&
                TypesForShapes.includes(curType)) {

                lineLength++;

                if (lineLength >= 3) {
                    foundLine = {
                        coords: {
                            r,
                            c
                        },
                        length: lineLength,
                        disabled: false,
                        booster: null
                    }
                }
            } else {
                lineLength = 1;

                if (foundLine !== null) {
                    addLine(foundLine)
                    foundLine = null;
                }
            }

            curType = row[c].cell.type;

            // save line if line exist and it is last cell in row
            if (foundLine !== null && c === matrix.lastCol) {
                addLine(foundLine)
            }

        }

    })



    function addLine(lineConfig: Line) {
        foundLines[`hLine` + currentLineId++] = lineConfig;
    }

    return foundLines;
}

export function findVLines(matrix: Matrix): Lines {
    let foundLines: Lines = {};
    let currentLineId: number = 1;

    matrix.eachCol((col, c) => {
        let curType: CellTypes | null = null;
        let lineLength: number = 1;
        let foundLine: Line | null = null;

        for (let r = 0; r <= matrix.lastRow; r++) {

            if (curType === col[r].cell.type &&
                TypesForShapes.includes(curType)) {

                lineLength++;

                if (lineLength >= 3) {
                    foundLine = {
                        coords: {
                            r,
                            c
                        },
                        length: lineLength,
                        disabled: false,
                        booster: null,
                    }
                }

            } else {
                lineLength = 1;

                if (foundLine !== null) {
                    addLine(foundLine)
                    foundLine = null;
                }
            }

            curType = col[r].cell.type;

            // save line if line exist and it is last cell in column
            if (foundLine !== null && r === matrix.lastRow) {
                addLine(foundLine)
            }

        }

    })

    function addLine(lineConfig: Line) {
        foundLines[`vLine${currentLineId++}`] = lineConfig;
    }
    return foundLines;

}
