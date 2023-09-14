export const gridHeight = 7;
export const gridWidth = 6;

export const typeColors = [
    '#eabd29',
    '#ce1f1f',
    '#4455ff',
    '#ef77ff',
    '#8500b6',
    '#000',
    '#ffffff',
]

export const colorTypePairs = {
    'ж': 0,
    'к': 1,
    'с': 2,
    'р': 3,
    'ф': 4,
    'ч': 5,
}

export const imageTypePairs = {
    0: 'coin',
    1: 'case',
    2: 'wallet',
    3: 'pig',
    4: 'hourglass',
}

export function highlightCombinations(matrix, initialCombination) {
    const hLines = findHLines(matrix)
    const vLines = findVLines(matrix)
    const squares = findSquare(matrix)

    // mark figures in matrix
    markHLinesInMatrix(matrix ,hLines)
    markVLinesInMatrix(matrix, vLines)
    markSquaresInMatrix(matrix, squares)
    // markStepInitialCells(matrix, initialCombination)

    // merge different figures (ordinary lines, squares and sun lines)
    mergeLinesAndSun(matrix, hLines, vLines)
    mergeLinesAndSquares(matrix, hLines, vLines, squares)

    // highlight all cells in all figures
    highlightCells(matrix)

    markDeletedForOrdinaryLines(matrix, hLines, vLines)
    markDeletedForSun(matrix)
    markDeletedForSquares(matrix, squares)
}

function markStepInitialCells(matrix, stepInitialCells) {
    console.log(stepInitialCells)
}

function mergeLinesAndSquares(matrix, hLines, vLines, squares) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.hLine && cell.square) {
                if (hLines[cell.hLine]['length'] >= 4) {
                    squares[cell.square]['disabled'] = true
                } else {
                    hLines[cell.hLine]['disabled'] = true
                }
            }
            if (cell.vLine && cell.square) {
                if (vLines[cell.vLine]['length'] >= 4) {
                    squares[cell.square]['disabled'] = true
                } else {
                    vLines[cell.vLine]['disabled'] = true
                }
            }
        })
    })
}

export function applyCombinations(matrix) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.deletedtrue) {
                cell.type = null;
            }
            if (cell.booster) {
                // todo прописать поточнее типы для ячеек
                cell.type = 6;
            }
        })
    })
}


export function findHLines(grid) {
    let foundLines = {};
    let currentLine = 1;

    for (let r = 0; r < gridHeight; r++) {

        let currentType = null;
        let lineLength = 1;
        let findLine = null;

        for (let c = 0; c < gridWidth; c++) {

            if (currentType === grid[r][c].type &&
                currentType !== undefined &&
                currentType !== 5) {

                lineLength++;

                if (lineLength >= 3) {
                    findLine = {
                        coords: {
                            r,
                            c
                        },
                        length: lineLength
                    }
                }
            } else {
                lineLength = 1;

                if (findLine !== null) {
                    addLine(findLine)
                    findLine = null;
                }
            }

            currentType = grid[r][c].type;

            // save line if line exist and it is last cell in row
            if (findLine !== null && c === gridWidth - 1) {
                addLine(findLine)
            }

        }
    }

    function addLine(lineConfig) {
        foundLines[`hLine${currentLine++}`] = lineConfig;
    }

    return foundLines;
}

export function findVLines(grid) {
    let foundLines = {};

    let currentLine = 1;

    for (let c = 0; c < gridWidth; c++) {
        let currentType = null;
        let lineLength = 1;

        let findLine = null;

        for (let r = 0; r < gridHeight; r++) {
            if (currentType === grid[r][c].type &&
                currentType !== undefined &&
                currentType !== 5) {

                lineLength++;

                if (lineLength >= 3) {
                    findLine = {
                        coords: {
                            r,
                            c
                        },
                        length: lineLength
                    }
                }
            } else {
                lineLength = 1;

                if (findLine !== null) {
                    addLine(findLine)
                    findLine = null;
                }
            }

            currentType = grid[r][c].type;

            // save line if line exist and it is last cell in column
            if (findLine !== null && r === gridHeight - 1) {
                addLine(findLine)
            }

        }
    }

    function addLine(lineConfig) {
        foundLines[`vLine${currentLine++}`] = lineConfig;
    }

    return foundLines;

}

export function findSquare(matrix) {
    let foundSquares = {};
    let currentSquare = 1;

    for (let r = 0; r < gridHeight - 1; r++) {
        for (let c = 0; c < gridWidth - 1; c++) {
            const currentType = matrix[r][c].type;

            if (currentType !== undefined &&
                matrix[r + 1][c].type === currentType &&
                matrix[r][c + 1].type === currentType &&
                matrix[r + 1][c + 1].type === currentType
            ) {
                foundSquares[`square${currentSquare++}`] = {
                    coords: {
                        r,
                        c
                    },
                    disabled: false
                }
            }
        }
    }

    return foundSquares;
}


export function getTotalPoints(matrix) {
    return matrix.reduce((sum, row) => sum + row.reduce((sum, cell) => sum + !!cell.deleted, 0), 0)
}


export function highlightHLines(grid, linesConfigs, propName = 'highlighted') {
    linesConfigs.forEach(config => {
        for (let i = config.coords[1]; i > config.coords[1] - config.length; i--) {
            grid[config.coords[0]][i][propName] = true;
        }
    })
}

export function highlightVLines(grid, linesConfigs, propName = 'highlighted') {
    linesConfigs.forEach(config => {
        for (let i = config.coords[0]; i > config.coords[0] - config.length; i--) {
            grid[i][config.coords[1]][propName] = true;
        }
    })
}


export function markSquaresInMatrix(matrix, squareConfigs) {
    for (let key in squareConfigs) {
        matrix[squareConfigs[key].coords.r][squareConfigs[key].coords.c].square = key;
        matrix[squareConfigs[key].coords.r + 1][squareConfigs[key].coords.c].square = key;
        matrix[squareConfigs[key].coords.r][squareConfigs[key].coords.c + 1].square = key;
        matrix[squareConfigs[key].coords.r + 1][squareConfigs[key].coords.c + 1].square = key;
    }

}

export function getExistedVariants(grid) {
    const variants = [];

    const initialMatrix = JSON.parse(JSON.stringify(grid))
    let variationMatrix = JSON.parse(JSON.stringify(grid))

    for (let r = 0; r < gridHeight; r++) {
        for (let c = 0; c < gridWidth; c++) {

            // vertical and horizontal swaps
            const orientationVariants = [
                {
                    condition: c < gridWidth - 1,
                    rowInc: 0,
                    colInc: 1
                },
                {
                    condition: r < gridHeight - 1,
                    rowInc: 1,
                    colInc: 0
                }
            ]
            

            orientationVariants.forEach(orientationVariant => {
                
                
                if (orientationVariant.condition) {
                    applyVariant(variationMatrix, {
                        cell1: {r: r, c: c},
                        cell2: {r: r + orientationVariant.rowInc, c: c + orientationVariant.colInc}
                    })

                    let points = 0;
                    let additionalPoints = 0;
                    let isInitialCombination = true;
                    const initialCombination = [
                        {
                            r,
                            c
                        },
                        {
                            r: r + orientationVariant.rowInc,
                            c: c + orientationVariant.colInc
                        }
                    ]

                    do {
                        additionalPoints = 0;
                        highlightCombinations(variationMatrix, isInitialCombination ? initialCombination : null);
                        additionalPoints = getTotalPoints(variationMatrix);
                        applyCombinations(variationMatrix)
                        resetMatrix(variationMatrix);
                        gridGetDown(variationMatrix);
                        points += additionalPoints;
                        isInitialCombination = false;
                        console.log('test')
                    } while (additionalPoints !== 0)

                    if (points) {
                        const variant = {
                            cell1: {
                                r,
                                c
                            },
                            cell2: {
                                r: r + orientationVariant.rowInc,
                                c: c + orientationVariant.colInc
                            },
                            points: points
                        }
                        
                        variants.push(variant);
                    }

                    variationMatrix = JSON.parse(JSON.stringify(initialMatrix))
                }

            })
        }
    }

    return variants;
}

export function resetMatrix(matrix) {
    matrix.forEach(row => {
        row.forEach(cell => {
            cell.highlighted = false;
            cell.deleted = false;
            cell.hLine = null;
            cell.vLine = null;
            cell.square = null;
        })
    })
}


export function applyVariant(grid, variant) {
    let tmpType = grid[variant.cell1.r][variant.cell1.c].type
    grid[variant.cell1.r][variant.cell1.c].type = grid[variant.cell2.r][variant.cell2.c].type
    grid[variant.cell2.r][variant.cell2.c].type = tmpType
}

export function gridGetDown(grid) {
    for (let r = 0; r < gridHeight; r++) {
        for (let c = 0; c < gridWidth; c++) {
            if (grid[r][c].type === null) {
                downColumn(grid, r, c)
            }
        }
    }
}

function downColumn(grid, row, col) {
    for (let r = row; r > 0; r--) {
        grid[r][col].type = grid[r - 1][col].type;
    }
    grid[0][col].type = undefined
}


export function highlightCells(matrix) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.vLine || cell.hLine || cell.square) {
                cell.highlighted = true;
            }
        })
    })
}

function findSunCenter(matrix) {
    const sun = []
    matrix.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            if (cell.hLine && cell.vLine) {
                sun.push({
                    r: rIndex,
                    c: cIndex
                })
            }
        })
    })
    return sun
}

function findSunRays(matrix, sunCenterCoords) {
    const currentType = matrix[sunCenterCoords.r][sunCenterCoords.c].type

    const rayLeft = checkCellAndType(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 1}, currentType) &&
        checkCellAndType(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 2}, currentType)

    const rayRight = checkCellAndType(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 1}, currentType) &&
        checkCellAndType(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 2}, currentType)

    const rayTop = checkCellAndType(matrix, {r: sunCenterCoords.r - 1, c: sunCenterCoords.c}, currentType) &&
        checkCellAndType(matrix, {r: sunCenterCoords.r - 2, c: sunCenterCoords.c}, currentType)

    const rayBottom = checkCellAndType(matrix, {r: sunCenterCoords.r + 1, c: sunCenterCoords.c}, currentType) &&
        checkCellAndType(matrix, {r: sunCenterCoords.r + 2, c: sunCenterCoords.c}, currentType)

    return {
        l: rayLeft,
        r: rayRight,
        t: rayTop,
        b: rayBottom
    }
    
}

function checkCellAndType(matrix, coords, type) {
    return !!(matrix[coords.r] && matrix[coords.r][coords.c] && (matrix[coords.r][coords.c].type === type))
}

export function markHLinesInMatrix(matrix, hLines) {
    for (let key in hLines) {
        for (let i = hLines[key].coords.c; i > hLines[key].coords.c - hLines[key].length; i--) {
            matrix[hLines[key].coords.r][i]['hLine'] = key;
        }
    }
}

export function markVLinesInMatrix(matrix, hLines) {
    for (let key in hLines) {
        for (let i = hLines[key].coords.r; i > hLines[key].coords.r - hLines[key].length; i--) {
            matrix[i][hLines[key].coords.c]['vLine'] = key;
        }
    }
}

export function mergeLinesAndSun(matrix, hLines, vLines) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.hLine && cell.vLine) {
                // todo проработать появление в линиях солнца квадрата
                hLines[cell.hLine]['disabled'] = true
                vLines[cell.vLine]['disabled'] = true
            }
        })
    })
}

export function markDeletedForOrdinaryLines(matrix, hLines, vLines) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if ( cell.hLine && !hLines[cell.hLine]['disabled'] ||
                 cell.vLine && !vLines[cell.vLine]['disabled']) {
                cell.deleted = true;
            }
        })
    })
}

function markDeletedForSquares(matrix, squares) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.square && !squares[cell.square]['disabled']) {
                cell.deleted = true;
            }
        })
    })
}

export function markDeletedForSun(matrix) {
    const sunCentersCoords = findSunCenter(matrix)

    sunCentersCoords.forEach(sunCenterCoords => {
        const sunRays = findSunRays(matrix, sunCenterCoords)
        markCellAsDeleted(matrix, sunCenterCoords)
        markCellAsBooster(matrix, sunCenterCoords)

        if (sunRays.r && !sunRays.l) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 1})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 2})
        } else if (sunRays.l) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 1})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 2})
        } else if (!sunRays.l && !sunRays.r) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c - 1})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r, c: sunCenterCoords.c + 1})
        }

        if (sunRays.t && !sunRays.b) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r - 1, c: sunCenterCoords.c})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r - 2, c: sunCenterCoords.c})
        } else if (sunRays.b) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r + 1, c: sunCenterCoords.c})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r + 2, c: sunCenterCoords.c})
        } else if (!sunRays.b && !sunRays.t) {
            markCellAsDeleted(matrix, {r: sunCenterCoords.r - 1, c: sunCenterCoords.c})
            markCellAsDeleted(matrix, {r: sunCenterCoords.r + 1, c: sunCenterCoords.c})
        }
    })
    
}


function markCellAsDeleted(matrix, coords) {
    matrix[coords.r][coords.c]['deleted'] = true;
}

function markCellAsBooster(matrix, coords) {
    matrix[coords.r][coords.c]['booster'] = true;
}