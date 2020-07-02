import calcLinearRegression from './calcLinearRegression'
import {calcTScore, calcZScore} from './oneSampleMean'
import {IRegressionCI} from '../components/projectComponents/projectInterfaces'

interface DataInterface {
    x: number;
    y: number;
}

export default function RegressionCI(info:IRegressionCI['properties'], data:string[][]) {

    const {xNum, yNum, confidence} = info
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
    const tScore = n - 3 >= 0 && n - 3 < 30 ? calcTScore(confidence, n - 3) : calcZScore(confidence)

    return {a, b, SE, interval: tScore * SE}
}