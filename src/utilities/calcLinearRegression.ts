

interface dataInterface {
    x: number;
    y: number;
}

export default function calcLinearRegression(rows, xNum, yNum) {
    const data: dataInterface[] = rows.map((row:any, index:number) => {
        if(index === 0) return
        if(row[yNum] !== 0 || row[xNum] !== 0) if(!row[xNum] || !row[yNum]) return
        return {x: Number(row[xNum]), y: Number(row[yNum])}
    }).filter((dataPoint: dataInterface) => dataPoint)

    const xSum = data.reduce((sum:number, point:dataInterface) => sum += point.x, 0)
    const ySum = data.reduce((sum:number, point:dataInterface) => sum += point.y, 0)
    const xySum = data.reduce((sum:number, point:dataInterface) => sum += (point.x * point.y), 0)
    const x2Sum = data.reduce((sum:number, point:dataInterface) => sum += Math.pow(point.x, 2), 0)
    const y2Sum = data.reduce((sum:number, point:dataInterface) => sum += Math.pow(point.y, 2), 0)
    const n = data.length

    const slope = ((n * xySum) - (xSum * ySum)) / ((n * x2Sum) - (xSum * xSum))
    const yInt = ((x2Sum * ySum) - (xSum * xySum)) / ((n * x2Sum) - (xSum * xSum))
    
    const r2 = (Math.pow((n * xySum) - (xSum * ySum), 2)) / (((n * x2Sum) - (xSum * xSum)) * ((n * y2Sum) - (ySum * ySum)))
    const r = slope > 0 ? Math.sqrt(r2) : -1 * Math.sqrt(r2)

    //console.log('slope', slope)
    //console.log('yInt', yInt)
    // console.log('r', r)
    // console.log('r2', r2)

    return {a: slope, b: yInt, r, r2}
}