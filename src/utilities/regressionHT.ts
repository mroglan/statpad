import calcLinearRegression from './calcLinearRegression'
import errorFunction from './errorFunction'

interface DataInterface {
    x: number;
    y: number;
}

export default function RegressionHT({xNum, yNum, comparison}, data:string[][]) {

    const {a, b} = calcLinearRegression(data, xNum, yNum)

    const filteredData = data.map((row:string[], index:number) => {
        if(index === 0) return
        if(!row[xNum] || !row[yNum]) return
        return {x: Number(row[xNum]), y: Number(row[yNum])}
    }).filter(el => el)

    const n = filteredData.length
    const xAvg = filteredData.reduce((sum:number, point:DataInterface) => sum += point.x, 0) / n
    const xMinusXAvg2Sum = filteredData.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.x - xAvg, 2), 0)
    const residual2Sum = filteredData.reduce((sum:number, point:DataInterface) => sum += Math.pow(point.y - ((a * point.x) + b), 2), 0)

    const SE = Math.sqrt((1 / (n - 2)) * (residual2Sum / xMinusXAvg2Sum))

    const tScore = a / SE
    const probToZero = (.5 -  (.5 * errorFunction(Math.abs(tScore) / Math.sqrt(2)))) * (comparison === 'notEqual' ? 2 : 1)

    const finalProb = comparison === 'notEqual' ? probToZero : comparison === 'less' && tScore > 0 ? 1 - probToZero : comparison === 'greater' && tScore < 0 ? 1 - probToZero : probToZero

    return {a, b, tScore, prob: finalProb}
}