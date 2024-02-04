import { Cell } from '~/core/classes/Cell'
import { TypesForShapes } from '~/core/types'

export const isCellSuitableForShape = (cell: Cell): boolean => {
  return TypesForShapes.includes(cell.type) && !cell.isCellForRemoving
}