import { Matrix } from '../classes/Matrix';
import { Coords } from '../types';

export default (matrix: Matrix, coords: Coords) => {
    const maxType = matrix.typeWithMaxCounter

    matrix.eachCell(({ cell }) => {
        if (cell.type !== maxType) return;
        cell.isCellForRemoving = true;
    })
}