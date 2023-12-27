import { MATRIX_HEIGHT, MATRIX_WIDTH } from '~/logic/constant-params';

import { CellTypes, Matrix, Squares } from "@/logic/types";


export function findSquare(matrix: Matrix) {
    let foundSquares: Squares = {};
    let currentSquare: number = 1;

    for (let r = 0; r < MATRIX_HEIGHT - 1; r++) {
        for (let c = 0; c < MATRIX_WIDTH - 1; c++) {
            const currentType = matrix[r][c].type;

            if (currentType !== null &&
                currentType !== CellTypes.Booster &&
                matrix[r + 1][c].type === currentType &&
                matrix[r][c + 1].type === currentType &&
                matrix[r + 1][c + 1].type === currentType
            ) {
                foundSquares[`square${currentSquare++}`] = {
                    coords: {
                        r,
                        c
                    },
                    disabled: false
                }
            }
        }
    }

    return foundSquares;
}
