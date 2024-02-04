import { CellTypes, Line, Lines, TypesForShapes } from '@/core/types';
import { Matrix } from '@/core/classes/Matrix';
import { isCellSuitableForShape } from '@/core/highlighting/find-shapes/is-cell-siutable-for-shapes'


export function findVLines(matrix: Matrix): Lines {
  let foundLines: Lines = {};
  let currentLineId: number = 1;

  matrix.eachCol((col, c) => {
    let curType: CellTypes | null = null;
    let lineLength: number = 1;
    let foundLine: Line | null = null;

    for (let r = 0; r <= matrix.lastRow; r++) {

      if (curType === col[r].cell.type &&
        isCellSuitableForShape(col[r].cell)) {

        lineLength++;

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
        lineLength = 1;

        if (foundLine !== null) {
          addLine(foundLine)
          foundLine = null;
        }
      }

      curType = col[r].cell.type;

      // save line if line exist and it is last cell in column
      if (foundLine !== null && r === matrix.lastRow) {
        addLine(foundLine)
      }

    }

  })

  function addLine(lineConfig: Line) {
    foundLines[`vLine${currentLineId++}`] = lineConfig;
  }

  return foundLines;

}
