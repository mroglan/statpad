

interface DataInterface {
    x: number;
    y: number;
    lnX: number;
}

export default function calcLnRegression(rows:string[][], xNum:number, yNum:number) {
    const data: DataInterface[] = rows.map((row, index:number) => {
        if(index === 0) return
        if(!row[xNum] || !row[yNum]) return
        return {x: Number(row[xNum]), lnX: Math.log(Number(row[xNum])), y: Number(row[yNum])}
    }).filter((dataPoint: DataInterface) => dataPoint)

    const n = data.length
    const lnXSum = data.reduce((sum:number, point:DataInterface) => sum += point.lnX, 0)
    const ySum = data.reduce((sum:number, point:DataInterface) => sum += point.y, 0)
    const ylnXSum = data.reduce((sum:number, point:DataInterface) => sum += (point.y * point.lnX), 0)
    const lnX2Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.lnX, 2), 0)

    const a = ((n * ylnXSum) - (ySum * lnXSum)) / ((n * lnX2Sum) - Math.pow(lnXSum, 2))
    const b = (ySum - (a * lnXSum)) / n

    const yAvg = ySum/n

    const sse = data.reduce((sum:number, point:DataInterface, index:number) => {
        return sum += Math.pow(point.y - (a * Math.log(point.x)) - b , 2)
    }, 0)

    const sst = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.y - yAvg, 2), 0)

    const r2 = 1 - (sse/sst)
    const r = a > 0 ? Math.sqrt(r2) : -1 * Math.sqrt(r2)

    console.log('r2', r2)

    return {a, b, r2, r}
}