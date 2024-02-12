import { Matrix } from '~/core/classes/Matrix'
import { SwapCells } from '~/core/types'
import { highlightShapes } from '~/core/highlighting/highlight-shapes'

export const checkMatrixHasShapes = (matrix: Matrix) => {
  highlightShapes(matrix)
  const result = !!matrix.totalPoints
  matrix.reset()
  return result
}
