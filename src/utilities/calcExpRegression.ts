
interface DataInterface {
    x: number;
    y: number;
}

export default function calcExpRegression(rows:string[][], xNum:number, yNum:number) {
    const data: DataInterface[] = rows.map((row, index:number) => {
        if(index === 0) return
        if(!row[xNum] || !row[yNum]) return
        return {x: Number(row[xNum]), y: Number(row[yNum])}
    }).filter((dataPoint: DataInterface) => dataPoint)
    
    const n = data.length
    const lnySum = data.reduce((sum:number, point:DataInterface) => sum += Math.log(point.y), 0)
    const xSum = data.reduce((sum:number, point:DataInterface) => sum += point.x, 0)
    const x2Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x, 2), 0)
    const xlnySum = data.reduce((sum:number, point:DataInterface) => sum += (Math.log(point.y) * point.x), 0)
    const lny2Sum = data.reduce((sum:number, point:DataInterface) => sum += Math.pow(Math.log(point.y), 2), 0)

    const a = Math.pow(Math.E, ((lnySum * x2Sum) - (xSum * xlnySum)) / ((n * x2Sum) - Math.pow(xSum, 2)))
    const b = ((n * xlnySum) - (xSum * lnySum)) / ((n * x2Sum) - Math.pow(xSum, 2))

    // console.log('a', a)
    // console.log('b', b)

    const r2 = (Math.pow((n * xlnySum) - (xSum * lnySum), 2)) / (((n * x2Sum) - (xSum * xSum)) * ((n * lny2Sum) - (lnySum * lnySum)))
    const r = b > 1 ? Math.sqrt(r2) : -1 * Math.sqrt(r2)

    return {a, b, r, r2}
}