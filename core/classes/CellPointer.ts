import { Cell } from '../classes/Cell';
import { CellTypes, Coords } from '../types';

export class CellPointer {
    cell: Cell = new Cell();
    coords: Coords = {
        r: 0,
        c: 0
    }

    constructor(coords: Coords = {r: 0, c: 0}, type: CellTypes = CellTypes.empty) {
        this.cell = new Cell(type);
        this.coords.r = coords.r;
        this.coords.c = coords.c;
    }
}
