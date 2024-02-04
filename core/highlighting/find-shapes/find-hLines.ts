import { Matrix } from '~/core/classes/Matrix'
import { CellTypes, Line, Lines } from '~/core/types'
import { isCellSuitableForShape } from '~/core/highlighting/find-shapes/is-cell-siutable-for-shapes'

export function findHLines(matrix: Matrix): Lines {
  let foundLines: Lines = {}
  let currentLineId: number = 1

  matrix.eachRow((row, r) => {
    let curType: CellTypes | null = null
    let lineLength: number = 1
    let foundLine: Line | null = null

    for (let c = 0; c <= matrix.lastCol; c++) {

      if (!isCellSuitableForShape(row[c].cell)) {
        curType = null
        lineLength = 1
        checkFoundedLine()
        continue
      }

      if (curType === row[c].cell.type) {

        lineLength++

        if (lineLength >= 3) {
          foundLine = {
            coords: {
              r,
              c
            },
            length: lineLength,
            disabled: false,
            booster: null,
          }
        }

      } else {
        lineLength = 1
        checkFoundedLine()
      }
      curType = row[c].cell.type
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
    foundLines[`hLine` + currentLineId++] = lineConfig
  }

  return foundLines
}
