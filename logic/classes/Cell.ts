import { Booster, BoosterTypes, CellTypes } from '~/logic/types';

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

    get isCellInShape2() {
        console.log('getter hooray')
        return this.vLine || this.hLine || this.square
    }

    constructor(type = CellTypes.empty) {
        this.type = type;
    }
}
