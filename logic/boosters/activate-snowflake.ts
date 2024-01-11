import { Matrix } from '../classes/Matrix';
import { Coords, snowflakeRays } from '../types';

export default (matrix: Matrix, { r, c }: Coords) => {
    snowflakeRays.forEach(({ rInc, cInc }) => {
        const row = r + rInc
        const col = c + cInc

        if (!matrix.isCoordsInside({ r: row, c: col })) return;

        matrix[row][col].cell.isCellForRemoving = true;
    })
}