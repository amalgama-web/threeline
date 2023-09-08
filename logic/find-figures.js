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

export function findHLines(grid) {
    let findLines = [];

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
                        coordinates: [r, c],
                        length: lineLength
                    }
                }
            } else {
                lineLength = 1;

                if (findLine !== null) {
                    findLines.push(findLine);
                    findLine = null;
                }
            }

            currentType = grid[r][c].type;

            // save line if line exist and it is last cell in row
            if (findLine !== null && c === gridWidth - 1) {
                findLines.push(findLine);
            }

        }
    }

    return findLines;

}

export function findVLines(grid) {
    let findLines = [];

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
                        coordinates: [r, c],
                        length: lineLength
                    }
                }
            } else {
                lineLength = 1;

                if (findLine !== null) {
                    findLines.push(findLine);
                    findLine = null;
                }
            }

            currentType = grid[r][c].type;

            // save line if line exist and it is last cell in column
            if (findLine !== null && r === gridHeight - 1) {
                findLines.push(findLine);
            }

        }
    }

    return findLines;

}

export function findSquare(grid) {
    let findSquares = [];

    for (let r = 0; r < gridHeight - 1; r++) {
        for (let c = 0; c < gridWidth -1 ; c++) {
            const currentType = grid[r][c].type;

            if (currentType !== undefined &&
                grid[r + 1][c].type === currentType &&
                grid[r][c + 1].type === currentType &&
                grid[r + 1][c + 1].type === currentType
            ) {
               findSquares.push([r,c])
            }
        }
    }

    return findSquares;
}


// highlights
export function highlightHLines(grid, linesConfigs) {
    linesConfigs.forEach(config => {
        for (let i = config.coordinates[1]; i > config.coordinates[1] - config.length; i--) {
            grid[config.coordinates[0]][i].highlighted = true;
        }
    })
}
export function highlightVLines(grid, linesConfigs) {
    linesConfigs.forEach(config => {
        for (let i = config.coordinates[0]; i > config.coordinates[0] - config.length; i--) {
            grid[i][config.coordinates[1]].highlighted = true;
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


export function getExistedResults(grid) {
    const variants = [];

    const initialGrid = JSON.parse(JSON.stringify(grid))
    console.log(grid)
    console.log(initialGrid)

    for (let r = 0; r < gridHeight; r++) {
        for (let c = 0; c < gridWidth; c++) {

            if (c < gridWidth - 1) {
                applyVariant(grid, {
                    cell1: {r: r, c: c},
                    cell2: {r: r, c: c + 1}
                })
                highlight(grid)
                let points = getTotalPoints(grid);

                if (points) {
                    let additionalPoints = 0;
                    do {
                        additionalPoints = 0;
                        removeHighlighted(grid);
                        gridGetDown(grid);
                        highlight(grid);
                        additionalPoints = getTotalPoints(grid);
                        points += additionalPoints;
                    } while (additionalPoints !== 0)

                    const variant = {
                        cell1: {
                            r,
                            c
                        },
                        cell2: {
                            r: r,
                            c: c + 1
                        },
                        points: points
                    }
                    variants.push(variant);
                    console.log(`Row: ${r}, Col: ${c}, ${c + 1}, Points: ${points}`)
                }


                // back
                grid = JSON.parse(JSON.stringify(initialGrid))
            }

            if (r < gridHeight - 1) {
                applyVariant(grid, {
                    cell1: {r: r, c: c},
                    cell2: {r: r + 1, c: c}
                })
                highlight(grid)
                let points = getTotalPoints(grid);

                if (points) {
                    let additionalPoints = 0;
                    do {
                        additionalPoints = 0;
                        removeHighlighted(grid);
                        gridGetDown(grid);
                        highlight(grid);
                        additionalPoints = getTotalPoints(grid);
                        points += additionalPoints;
                    } while (additionalPoints !== 0)

                    variants.push({
                        cell1: {
                            r,
                            c
                        },
                        cell2: {
                            r: r + 1,
                            c
                        },
                        points: points
                    });
                    console.log(`Row: ${r}, ${r + 1}, Col: ${c}, Points: ${points}`)
                }

                grid = JSON.parse(JSON.stringify(initialGrid))
            }
        }
    }
    debugger
    grid = JSON.parse(JSON.stringify(initialGrid))

    return variants;
}

export function getTotalPoints(grid) {
    return grid.reduce((sum, row) => sum + row.reduce((sum, cell) => sum + cell.highlighted, 0), 0)
}

function highlight(grid) {
    highlightHLines(grid, findHLines(grid))
    highlightVLines(grid, findVLines(grid))
    highlightSquare(grid, findSquare(grid))
}

function resetHighlight(grid) {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.highlighted = false;
        })
    })
}


export function removeHighlighted(grid) {
    grid.forEach(row => {
        row.forEach(cell => {
            if (cell.highlighted === true) {
                cell.type = undefined;
                cell.highlighted = false;
            }
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
            if (grid[r][c].type === undefined) {
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


