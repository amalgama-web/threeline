import { Matrix } from '~/core/classes/Matrix'
import { CellTypes, Line, Lines } from '~/core/types'
import { isCellSuitableForShape } from '~/core/highlighting/find-shapes/is-cell-siutable-for-shapes'

export function findVLines(matrix: Matrix): Lines {
  let foundLines: Lines = {}
  let currentLineId: number = 1

  matrix.eachCol((col, c) => {
    let curType: CellTypes | null = null
    let lineLength: number = 1
    let foundLine: Line | null = null

    for (let r = 0; r <= matrix.lastRow; r++) {

      if (!isCellSuitableForShape(col[r].cell)) {
        curType = null
        lineLength = 1
        checkFoundedLine()
        continue
      }

      if (curType === col[r].cell.type) {

        lineLength++

        if (lineLength >= 3) {
          foundLine = {
            coords: {
              r,
              c
            },
            length: lineLength,
          }
        }

      } else {
        lineLength = 1
        checkFoundedLine()
      }
      curType = col[r].cell.type
    }
    checkFoundedLine()

    function checkFoundedLine() {
      if (foundLine !== null) {
        addLine(foundLine)
        foundLine = null
      }
    }

  })

  function addLine(lineConfig: Line) {
    foundLines[`vLine${ currentLineId++ }`] = lineConfig
  }

  return foundLines
}
