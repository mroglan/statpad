

interface DataInterface {
    x: number;
    y: number;
}

export default function calcQuadraticRegression(rows:string[][], xNum:number, yNum:number) {
    const data: DataInterface[] = rows.map((row, index:number) => {
        if(index === 0) return
        if(!row[xNum] || !row[yNum]) return
        return {x: Number(row[xNum]), y: Number(row[yNum])}
    }).filter((dataPoint: DataInterface) => dataPoint)

    const xSum = data.reduce((sum:number, point:DataInterface) => sum += point.x, 0)
    const ySum = data.reduce((sum:number, point:DataInterface) => sum += point.y, 0)
    const x2Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 2), 0)
    const x3Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 3), 0)
    const x4Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 4), 0)
    const xySum = data.reduce((sum:number, point:DataInterface) => sum += (point.x * point.y), 0)
    const x2ySum = data.reduce((sum:number, point:DataInterface) => sum += (Math.pow(point.x, 2) * point.y), 0)
    const n = data.length

    // console.log({
    //     xSum, ySum, x2Sum, x3Sum, x4Sum, xySum, x2ySum, n
    // })

    const xx = x2Sum - (Math.pow(xSum, 2) / n)
    const xy = xySum - ((xSum * ySum) / n)
    const xx2 = x3Sum - ((x2Sum * xSum) / n)
    const x2y = x2ySum - ((x2Sum * ySum) / n)
    const x2x2 = x4Sum - (Math.pow(x2Sum, 2) / n)

    //console.log({xx, xy, xx2, x2y, x2x2})

    const a = ((x2y * xx) - (xy * xx2)) / ((xx * x2x2) - Math.pow(xx2, 2))
    const b = ((xy * x2x2) - (x2y * xx2)) / ((xx * x2x2) - Math.pow(xx2, 2))
    const c = (ySum / n) - (b * (xSum / n)) - (a * (x2Sum / n))

    // console.log('a', a)
    // console.log('b', b)
    // console.log('c', c)

    const yAvg = ySum/n

    const sse = data.reduce((sum:number, point:DataInterface, index:number) => {
        return sum += Math.pow(point.y - (a * Math.pow(point.x, 2)) - (b * point.x) - c, 2)
    }, 0)

    const sst = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.y - yAvg, 2), 0)

    const r2 = 1 - (sse/sst)
    //const r = Math.sqrt(r2)

    return {a, b, c, r2}
}