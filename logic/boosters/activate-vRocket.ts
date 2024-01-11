import { Matrix } from '../classes/Matrix';
import { Coords } from '../types';

export default (matrix: Matrix, { r, c }: Coords) => {
    matrix.eachCellInCol(c, ({ cell }) => {
        cell.isCellForRemoving = true;
    })
}