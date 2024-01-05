import { Booster, BoosterTypes, CellTypes } from '~/logic/types';

export class Cell {
    type: CellTypes = CellTypes.empty;
    isCellForRemoving: boolean = false;
    isCellInShape: boolean = false;
    vLine: string | null = null;
    hLine: string | null = null;
    square: string | null = null;
    emergingBooster: Booster | null = null;
    booster: BoosterTypes | null = null;
}
