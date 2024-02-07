import { Matrix } from '~/core/classes/Matrix'
import { findVLines } from '~/core/highlighting/find-shapes/find-vLines'
import { Lines, Line } from '~/core/types'
import { describe, test, expect } from '@jest/globals'

describe('Нахождение вертикальных линий', () => {

  test('Отсутствие линий', () => {
    const matrix = Matrix.fromString('212523231134122113451423145532544331432454')
    const result: Lines = {}
    expect(findVLines(matrix)).toEqual(result)
  })

  test('Линия длина 3', () => {
    const matrix = Matrix.fromString('451531221443412255415153213342453113354125')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 4,
          c: 1
        },
        length: 3
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('Линия длина 4', () => {
    const matrix = Matrix.fromString('451531211443412255415153213342453113354125')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 4,
          c: 1
        },
        length: 4
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('Линия длина 5', () => {
    const matrix = Matrix.fromString('451531211443412255415153213342413113354125')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 5,
          c: 1
        },
        length: 5
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('Линия длина 6', () => {
    const matrix = Matrix.fromString('215422415215145522235124455454545315134122')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 5,
          c: 2
        },
        length: 6
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('Линия длина 7', () => {
    const matrix = Matrix.fromString('215422415215145522235124455454545315135122')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 6,
          c: 2
        },
        length: 7
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('Линия с начала 3', () => {
    const matrix = Matrix.fromString('215422415215145522234124455454543315134122')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 2,
          c: 2
        },
        length: 3
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('Линия в конце 3', () => {
    const matrix = Matrix.fromString('534231234435355142132414421445242543415144')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 6,
          c: 4
        },
        length: 3
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('Линия 5 прерванная пустой ячейкой', () => {
    const matrix = Matrix.fromString('224314523544441253544335103434144545445343')
    const result: Lines = {}
    expect(findVLines(matrix)).toEqual(result)
  })

  test('2 линии в разных столбцах', () => {
    const matrix = Matrix.fromString('255141431434513414524413545141441411334553')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 4,
          c: 0
        },
        length: 3
      },
      vLine2: {
        coords: {
          r: 3,
          c: 3
        },
        length: 3
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('2 линии в одном столбце', () => {
    const matrix = Matrix.fromString('435455434523131133352145225523422435524242')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 2,
          c: 1
        },
        length: 3
      },
      vLine2: {
        coords: {
          r: 6,
          c: 1
        },
        length: 3
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })

  test('2 линии в одном столбце', () => {
    const matrix = Matrix.fromString('435455434523131133332145225523422435524242')
    const result: Lines = {
      vLine1: {
        coords: {
          r: 3,
          c: 1
        },
        length: 4
      },
      vLine2: {
        coords: {
          r: 6,
          c: 1
        },
        length: 3
      }
    }
    expect(findVLines(matrix)).toEqual(result)
  })



})