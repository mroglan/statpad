

interface DataInterface {
    x: number;
    y: number;
}

export function determinant4x4(matrix: number[][]) {

    const matrix1 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 3 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix2 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 2 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix3 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 1 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix4 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 0 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    //console.log({matrix1, matrix2, matrix3, matrix4})

    const matrix1Determinant = determinant3x3(matrix1)
    const matrix2Determinant = determinant3x3(matrix2)
    const matrix3Determinant = determinant3x3(matrix3)
    const matrix4Determinant = determinant3x3(matrix4)

    return (-1 * matrix[0][3] * matrix1Determinant) + (matrix[0][2] * matrix2Determinant) - (matrix[0][1] * matrix3Determinant) + (matrix[0][0] * matrix4Determinant)
}

export function determinant3x3(matrix: number[][]) {

    const matrix1 = matrix.map((row:number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 2 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix2 = matrix.map((row:number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 1 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix3 = matrix.map((row:number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 0 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    //console.log({matrix1, matrix2, matrix3})

    const matrix1Determinant = (matrix1[0][0] * matrix1[1][1]) - (matrix1[0][1] * matrix1[1][0])
    const matrix2Determinant = (matrix2[0][0] * matrix2[1][1]) - (matrix2[0][1] * matrix2[1][0])
    const matrix3Determinant = (matrix3[0][0] * matrix3[1][1]) - (matrix3[0][1] * matrix3[1][0])

    return (matrix[0][2] * matrix1Determinant) - (matrix[0][1] * matrix2Determinant) + (matrix[0][0] * matrix3Determinant) 
}

export default function calcCubicRegression(rows, xNum, yNum) {
    const data: DataInterface[] = rows.map((row:any, index:number) => {
        if(index === 0) return
        if(row[yNum] !== 0 || row[xNum] !== 0) if(!row[xNum] || !row[yNum]) return
        return {x: Number(row[xNum]), y: Number(row[yNum])}
    }).filter((dataPoint: DataInterface) => dataPoint)

    const n = data.length
    const xSum = data.reduce((sum:number, point:DataInterface) => sum += point.x, 0)
    const x2Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 2), 0)
    const x3Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 3), 0)
    const x4Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 4), 0)
    const x5Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 5), 0)
    const x6Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 6), 0)

    const ySum = data.reduce((sum:number, point:DataInterface) => sum += point.y, 0)
    const xySum = data.reduce((sum:number, point:DataInterface) => sum += (point.x * point.y), 0)
    const x2ySum = data.reduce((sum:number, point:DataInterface) => sum += (Math.pow(point.x, 2) * point.y), 0)
    const x3ySum = data.reduce((sum:number, point:DataInterface) => sum += (Math.pow(point.x, 3) * point.y), 0)

    const matrix = [
        [n, xSum, x2Sum, x3Sum],
        [xSum, x2Sum, x3Sum, x4Sum],
        [x2Sum, x3Sum, x4Sum, x5Sum],
        [x3Sum, x4Sum, x5Sum, x6Sum]
    ]
    //console.log(matrix)

    const matrix0 = [
        [ySum, xSum, x2Sum, x3Sum],
        [xySum, x2Sum, x3Sum, x4Sum],
        [x2ySum, x3Sum, x4Sum, x5Sum],
        [x3ySum, x4Sum, x5Sum, x6Sum]
    ]

    const matrix1 = [
        [n, ySum, x2Sum, x3Sum],
        [xSum, xySum, x3Sum, x4Sum],
        [x2Sum, x2ySum, x4Sum, x5Sum],
        [x3Sum, x3ySum, x5Sum, x6Sum]
    ]

    const matrix2 = [
        [n, xSum, ySum, x3Sum],
        [xSum, x2Sum, xySum, x4Sum],
        [x2Sum, x3Sum, x2ySum, x5Sum],
        [x3Sum, x4Sum, x3ySum, x6Sum]
    ]

    const matrix3 = [
        [n, xSum, x2Sum, ySum],
        [xSum, x2Sum, x3Sum, xySum],
        [x2Sum, x3Sum, x4Sum, x2ySum],
        [x3Sum, x4Sum, x5Sum, x3ySum]
    ]

    const matrixDeterminant = determinant4x4(matrix)
    const matrix0Determinant = determinant4x4(matrix0)
    const matrix1Determinant = determinant4x4(matrix1)
    const matrix2Determinant = determinant4x4(matrix2)
    const matrix3Determinant = determinant4x4(matrix3)

    //console.log(matrixDeterminant)

    const a = matrix3Determinant / matrixDeterminant
    const b = matrix2Determinant / matrixDeterminant
    const c = matrix1Determinant / matrixDeterminant
    const d = matrix0Determinant / matrixDeterminant

    const yAvg = ySum / n

    const sst = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.y - yAvg, 2), 0)

    const sse = data.reduce((sum:number, point:DataInterface, index:number) => {
        return sum += Math.pow(point.y - (a * Math.pow(point.x, 3)) - (b * Math.pow(point.x, 2)) - (c * point.x) - d, 2)
    }, 0)

    const r2 = 1 - (sse/sst)
    //const r = Math.sqrt(r2)

    return {a, b, c, d, r2}
}