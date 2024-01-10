import { Cell } from '~/logic/classes/Cell';
import { CellTypes, Coords } from '~/logic/types';

export class CellPointer {
    cell: Cell = new Cell();
    coords: Coords = {
        r: 0,
        c: 0
    }

    constructor(coords: Coords, type: CellTypes = CellTypes.empty) {
        this.cell = new Cell(type);
        this.coords.r = coords.r;
        this.coords.c = coords.c;
    }
}
