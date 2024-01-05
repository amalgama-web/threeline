import { Cell } from '~/logic/classes/Cell';
import { Coords } from '~/logic/types';

export class CellPointer {
    cell: Cell = new Cell();
    coords: Coords = {
        r: 0,
        c: 0
    }

    constructor(coords: Coords) {
        this.cell = new Cell();
        this.coords.r = coords.r;
        this.coords.c = coords.c;
    }
}
