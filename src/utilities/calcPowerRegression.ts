

interface DataInterface {
    x: number;
    y: number;
}

export default function calcPowerRegression(rows:string[][], xNum:number, yNum:number) {
    const data: DataInterface[] = rows.map((row, index:number) => {
        if(index === 0) return
        if(!row[xNum] || !row[yNum]) return
        return {x: Number(row[xNum]), y: Number(row[yNum])}
    }).filter((dataPoint: DataInterface) => dataPoint)

    const n = data.length
    const lnySum = data.reduce((sum:number, point:DataInterface) => sum += Math.log(point.y), 0)
    const lnxSum = data.reduce((sum:number, point:DataInterface) => sum += Math.log(point.x), 0)
    const lnx2Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(Math.log(point.x), 2), 0)
    const lnxlnySum = data.reduce((sum:number, point:DataInterface) => sum += (Math.log(point.x) * Math.log(point.y)), 0)
    const lny2Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(Math.log(point.y), 2), 0)

    const a = Math.exp(((lnySum * lnx2Sum) - (lnxSum * lnxlnySum)) / ((n * lnx2Sum) - Math.pow(lnxSum, 2)))
    const b = ((n * lnxlnySum) - (lnxSum * lnySum)) / ((n * lnx2Sum) - Math.pow(lnxSum, 2))

    // console.log('a', a)
    // console.log('b', b)

    const r2 = (Math.pow((n * lnxlnySum) - (lnxSum * lnySum), 2)) / (((n * lnx2Sum) - (lnxSum * lnxSum)) * ((n * lny2Sum) - (lnySum * lnySum)))
    //const r2 = 1 - (sse/sst)
    const r = b > 0 ? Math.sqrt(r2) : -1 * Math.sqrt(r2)

    return {a, b, r2, r}
}