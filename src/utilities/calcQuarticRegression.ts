import {determinant4x4} from './calcCubicRegression'

interface DataInterface {
    x: number;
    y: number;
}

export function determinant5x5(matrix: number[][]) {

    const matrix1 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 4 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix2 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 3 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix3 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 2 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix4 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 1 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix5 = matrix.map((row: number[], index:number) => {
        if(index === 0) return
        return row.map((value:number, i:number) => i !== 0 ? value : null).filter((value:number) => value)
    }).filter((row:number[]) => row)

    const matrix1Determinant = determinant4x4(matrix1)
    const matrix2Determinant = determinant4x4(matrix2)
    const matrix3Determinant = determinant4x4(matrix3)
    const matrix4Determinant = determinant4x4(matrix4)
    const matrix5Determinant = determinant4x4(matrix5)

    return (matrix[0][0] * matrix5Determinant) - (matrix[0][1] * matrix4Determinant) + (matrix[0][2] * matrix3Determinant) - (matrix[0][3] * matrix2Determinant) + (matrix[0][4] * matrix1Determinant)
}

export default function calcQuarticRegression(rows, xNum, yNum) {
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
    const x7Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 7), 0)
    const x8Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 8), 0)

    const ySum = data.reduce((sum:number, point:DataInterface) => sum += point.y, 0)
    const xySum = data.reduce((sum:number, point:DataInterface) => sum += (point.x * point.y), 0)
    const x2ySum = data.reduce((sum:number, point:DataInterface) => sum += (Math.pow(point.x, 2) * point.y), 0)
    const x3ySum = data.reduce((sum:number, point:DataInterface) => sum += (Math.pow(point.x, 3) * point.y), 0)
    const x4ySum = data.reduce((sum:number, point:DataInterface) => sum += (Math.pow(point.x, 4) * point.y), 0)

    const matrix = [
        [n, xSum, x2Sum, x3Sum, x4Sum],
        [xSum, x2Sum, x3Sum, x4Sum, x5Sum],
        [x2Sum, x3Sum, x4Sum, x5Sum, x6Sum],
        [x3Sum, x4Sum, x5Sum, x6Sum, x7Sum],
        [x4Sum, x5Sum, x6Sum, x7Sum, x8Sum]
    ]

    const matrix0 = [
        [ySum, xSum, x2Sum, x3Sum, x4Sum],
        [xySum, x2Sum, x3Sum, x4Sum, x5Sum],
        [x2ySum, x3Sum, x4Sum, x5Sum, x6Sum],
        [x3ySum, x4Sum, x5Sum, x6Sum, x7Sum],
        [x4ySum, x5Sum, x6Sum, x7Sum, x8Sum]
    ]

    const matrix1 = [
        [n, ySum, x2Sum, x3Sum, x4Sum],
        [xSum, xySum, x3Sum, x4Sum, x5Sum],
        [x2Sum, x2ySum, x4Sum, x5Sum, x6Sum],
        [x3Sum, x3ySum, x5Sum, x6Sum, x7Sum],
        [x4Sum, x4ySum, x6Sum, x7Sum, x8Sum]
    ]

    const matrix2 = [
        [n, xSum, ySum, x3Sum, x4Sum],
        [xSum, x2Sum, xySum, x4Sum, x5Sum],
        [x2Sum, x3Sum, x2ySum, x5Sum, x6Sum],
        [x3Sum, x4Sum, x3ySum, x6Sum, x7Sum],
        [x4Sum, x5Sum, x4ySum, x7Sum, x8Sum]
    ]

    const matrix3 = [
        [n, xSum, x2Sum, ySum, x4Sum],
        [xSum, x2Sum, x3Sum, xySum, x5Sum],
        [x2Sum, x3Sum, x4Sum, x2ySum, x6Sum],
        [x3Sum, x4Sum, x5Sum, x3ySum, x7Sum],
        [x4Sum, x5Sum, x6Sum, x4ySum, x8Sum]
    ]

    const matrix4 = [
        [n, xSum, x2Sum, x3Sum, ySum],
        [xSum, x2Sum, x3Sum, x4Sum, xySum],
        [x2Sum, x3Sum, x4Sum, x5Sum, x2ySum],
        [x3Sum, x4Sum, x5Sum, x6Sum, x3ySum],
        [x4Sum, x5Sum, x6Sum, x7Sum, x4ySum]
    ]

    const matrixDeterminant = determinant5x5(matrix)
    const matrix0Determinant = determinant5x5(matrix0)
    const matrix1Determinant = determinant5x5(matrix1)
    const matrix2Determinant = determinant5x5(matrix2)
    const matrix3Determinant = determinant5x5(matrix3)
    const matrix4Determinant = determinant5x5(matrix4)

    const a = matrix4Determinant / matrixDeterminant
    const b = matrix3Determinant / matrixDeterminant
    const c = matrix2Determinant / matrixDeterminant
    const d = matrix1Determinant / matrixDeterminant
    const e = matrix0Determinant / matrixDeterminant

    const yAvg = ySum / n

    const sst = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.y - yAvg, 2), 0)

    const sse = data.reduce((sum:number, point:DataInterface, index:number) => {
        return sum += Math.pow(point.y - (a * Math.pow(point.x, 4)) - (b * Math.pow(point.x, 3)) - (c * Math.pow(point.x, 2)) - (d * point.x) - e, 2)
    }, 0)

    const r2 = 1 - (sse/sst)
    //const r = Math.sqrt(r2)

    return {a, b, c, d, e, r2}
}