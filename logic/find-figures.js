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

export function highlightCombinations(matrix) {
    const hLines = findHLines(matrix)
    const vLines = findVLines(matrix)
    // todo squares
    // const squares = findSquare(matrix)

    markHLinesInMatrix(matrix ,hLines)
    markVLinesInMatrix(matrix, vLines)


    disableCrossedLines(matrix, hLines, vLines)

    // highlight all cells in lines
    highlightCells(matrix)

    markDeletedForOrdinaryLines(matrix, hLines, vLines)
    markDeletedForSun(matrix)
}

export function applyCombinations(matrix) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.deleted === true) {
                cell.type = null;
            }
        })
    })
}


export function findHLines(grid) {
    let findLines = {};
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
        findLines[`hLine${currentLine++}`] = lineConfig;
    }

    return findLines;
}

export function findVLines(grid) {
    let findLines = {};

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
        findLines[`vLine${currentLine++}`] = lineConfig;
    }

    return findLines;

}

export function findSquare(grid) {
    let findSquares = [];

    for (let r = 0; r < gridHeight - 1; r++) {
        for (let c = 0; c < gridWidth - 1; c++) {
            const currentType = grid[r][c].type;

            if (currentType !== undefined &&
                grid[r + 1][c].type === currentType &&
                grid[r][c + 1].type === currentType &&
                grid[r + 1][c + 1].type === currentType
            ) {
                findSquares.push([r, c])
            }
        }
    }

    return findSquares;
}


export function getTotalPoints(grid) {
    return grid.reduce((sum, row) => sum + row.reduce((sum, cell) => sum + cell.deleted, 0), 0)
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


export function highlightSquare(grid, squareConfigs) {
    squareConfigs.forEach(config => {
        grid[config[0]][config[1]].highlighted = true;
        grid[config[0] + 1][config[1]].highlighted = true;
        grid[config[0]][config[1] + 1].highlighted = true;
        grid[config[0] + 1][config[1] + 1].highlighted = true;
    })
}

export function getExistedVariants(grid) {
    const variants = [];

    const initialMatrix = JSON.parse(JSON.stringify(grid))
    let variationMatrix = JSON.parse(JSON.stringify(grid))

    for (let r = 0; r < gridHeight; r++) {
        for (let c = 0; c < gridWidth; c++) {

            // vertical and horizontal swaps
            const changeVariants = [
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

            changeVariants.forEach(variant => {
                if (variant.condition) {
                    applyVariant(variationMatrix, {
                        cell1: {r: r, c: c},
                        cell2: {r: r + variant.rowInc, c: c + variant.colInc}
                    })

                    highlightCombinations(variationMatrix)

                    let points = getTotalPoints(variationMatrix);

                    if (points) {
                        let additionalPoints = 0;
                        do {
                            additionalPoints = 0;
                            applyCombinations(variationMatrix)
                            resetMatrix(variationMatrix);
                            gridGetDown(variationMatrix);
                            highlightCombinations(variationMatrix);
                            additionalPoints = getTotalPoints(variationMatrix);
                            points += additionalPoints;
                        } while (additionalPoints !== 0)

                        const variant = {
                            cell1: {
                                r,
                                c
                            },
                            cell2: {
                                r: r + variant.rowInc,
                                c: c + variant.colInc
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

function highlight(grid) {
    highlightVLines(grid, findVLines(grid))
    highlightHLines(grid, findHLines(grid))
    highlightSquare(grid, findSquare(grid))
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

export function disableCrossedLines(matrix, hLines, vLines) {
    matrix.forEach(row => {
        row.forEach(cell => {
            if (cell.hLine && cell.vLine) {
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


export function markDeletedForSun(matrix) {
    const sunCentersCoords = findSunCenter(matrix)

    console.log(sunCentersCoords)

    sunCentersCoords.forEach(sunCenterCoords => {
        const sunRays = findSunRays(matrix, sunCenterCoords)
        console.log(sunRays)
        markCellAsDeleted(matrix, sunCenterCoords)

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