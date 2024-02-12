import type { Ref } from 'vue'
import { CellPointer } from '~/core/classes/CellPointer'
import { ref } from 'vue'
import { CellTypes } from '~/core/types'


const useMatrixEditor = () => {

  const currentEditor: Ref<CellPointer | null> = ref(null)

  const cellClickEditorMode = (cellPointer: CellPointer) => {
    if (currentEditor.value === null) return

    if (currentEditor.value.cell.type === CellTypes.booster) {
      cellPointer.cell.type = CellTypes.booster
      cellPointer.cell.booster = currentEditor.value.cell.booster
    } else {
      cellPointer.cell.type = currentEditor.value.cell.type
    }
  }


  return {
    currentEditor,
    cellClickEditorMode,
  }
}

export default useMatrixEditor