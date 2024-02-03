import { Booster, BoosterTypes, CellTypes } from '../types';

export class Cell {
    // тип ячейки (пустая, обычная или бустер)
    type: CellTypes

    // ячейка помеченная на удаление и учитывающаяся при подстчете очков
    isCellForRemoving: boolean = false

    // ячейка приндлежит какой либо фигуре
    isCellInShape: boolean = false

    // вхождение ячейки в верт линию
    vLine: string | null = null

    // вхождение ячейки в гор линию
    hLine: string | null = null

    // вхождение ячейки в квадрат
    square: string | null = null

    // появляющийся бустер в ячейке
    emergingBooster: Booster | null = null

    // для ячеек с типом бустер - тип бустера
    booster: BoosterTypes | null = null

    // экспериментальное свойство для просчета позиций бустеров - ячейка которая была поменяна местами
    isSwappedCell: boolean = false

    // выбранная ячейка для игрового режима
    isCellSelected: boolean = false

    get isCellInShape2() {
        return this.vLine || this.hLine || this.square
    }

    constructor(type = CellTypes.empty) {
        this.type = type;
    }
}
