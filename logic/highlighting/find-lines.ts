import { MATRIX_HEIGHT, MATRIX_WIDTH } from '~/logic/constant-params';
import { Matrix, Line, Lines, CellTypes } from "~/logic/types";

export function findHLines(matrix: Matrix): Lines {
    let foundLines: Lines = {};
    let currentLineId: number = 1;


    for (let r = 0; r < MATRIX_HEIGHT; r++) {

        let currentType: CellTypes | null = null;
        let lineLength: number = 1;
        let foundLine: Line | null = null;

        for (let c = 0; c < MATRIX_WIDTH; c++) {

            if (currentType === matrix[r][c].type &&
                currentType !== null &&
                currentType !== CellTypes.booster) {

                lineLength++;

                if (lineLength >= 3) {
                    foundLine = {
                        coords: {
                            r,
                            c
                        },
                        length: lineLength,
                        disabled: false
                    }
                }
            } else {
                lineLength = 1;

                if (foundLine !== null) {
                    addLine(foundLine)
                    foundLine = null;
                }
            }

            currentType = matrix[r][c].type;

            // save line if line exist and it is last cell in row
            if (foundLine !== null && c === MATRIX_WIDTH - 1) {
                addLine(foundLine)
            }

        }
    }

    function addLine(lineConfig: Line) {
        foundLines[`hLine` + currentLineId++] = lineConfig;
    }

    return foundLines;
}


export function findVLines(matrix: Matrix): Lines {
    let foundLines: Lines = {};

    let currentLineId: number = 1;

    for (let c = 0; c < MATRIX_WIDTH; c++) {
        let currentType: CellTypes | null = null;
        let lineLength: number = 1;

        let foundLine: Line | null = null;

        for (let r = 0; r < MATRIX_HEIGHT; r++) {
            // todo подумать как удалить дублирование
            if (currentType === matrix[r][c].type &&
                currentType !== null &&
                currentType !== CellTypes.booster) {

                lineLength++;

                if (lineLength >= 3) {
                    foundLine = {
                        coords: {
                            r,
                            c
                        },
                        length: lineLength,
                        disabled: false,

                    }
                }
            } else {
                lineLength = 1;

                if (foundLine !== null) {
                    addLine(foundLine)
                    foundLine = null;
                }
            }

            currentType = matrix[r][c].type;

            // save line if line exist and it is last cell in column
            if (foundLine !== null && r === MATRIX_HEIGHT - 1) {
                addLine(foundLine)
            }

        }
    }

    function addLine(lineConfig: Line) {
        foundLines[`vLine${currentLineId++}`] = lineConfig;
    }

    return foundLines;

}
