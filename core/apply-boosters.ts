import { Matrix } from './classes/Matrix'
import { Cell } from './classes/Cell'
import { BoostersActions, BoosterTypes, CellTypes, Coords, snowflakeRays } from './types'
import { makeIterationAndGetPoints } from './game'
import { cutShapesAndSetBoosters } from './cut/cut-shapes-and-set-boosters'
import { fillMatrix } from './matrix-fill'
import { activateBoosters } from './boosters/activate-boosters'
import { delay } from '@/utils/main'

export async function applyBooster(matrix: Matrix, { r, c }: Coords) {

  const type = matrix[r][c].cell.booster
  if (type === null) return 0
  activateBoosters(matrix, [{
    type,
    coords: { r, c }
  }])

  // todo это подобная get points from step iteration
  let points = matrix.totalPoints

  await delay()
  cutShapesAndSetBoosters(matrix)
  matrix.reset()
  await delay()
  matrix.matrixGetDown()
  await delay()
  fillMatrix(matrix)
  await delay()

  const additionPoints = await makeIterationAndGetPoints(matrix)

  return points + additionPoints
}


