import { Booster, BoosterTypes, CellTypes } from '../types';

export class Cell {
    type: CellTypes;
    isCellForRemoving: boolean = false;
    isCellInShape: boolean = false;
    vLine: string | null = null;
    hLine: string | null = null;
    square: string | null = null;
    emergingBooster: Booster | null = null;
    booster: BoosterTypes | null = null;
    isSwappedCell: boolean = false;
    isCellSelected: boolean = false;

    get isCellInShape2() {
        return this.vLine || this.hLine || this.square
    }

    constructor(type = CellTypes.empty) {
        this.type = type;
    }
}