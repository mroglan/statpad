import {IOneSampleCI} from '../components/projectComponents/projectInterfaces'

export const tScores99 = [
    63.657, 9.925, 5.841, 4.604, 4.032, 3.707, 3.499, 3.355, 3.25, 3.169, 3.106, 3.055, 3.012, 2.977, 2.947, 2.921,
    2.898, 2.878, 2.861, 2.845, 2.831, 2.819, 2.807, 2.797, 2.787, 2.779, 2.771, 2.763, 2.756, 2.75
]

export const tScores95 = [
    12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.16, 2.145,
    2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042
]

export const tScores90 = [
    6.314, 2.92, 2.353, 2.132, 2.015, 1.943, 1.895, 1.86, 1.833, 1.812, 1.796, 1.782, 1.771, 1.761, 1.753, 1.746,
    1.74, 1.734, 1.729, 1.725, 1.721, 1.717, 1.714, 1.711, 1.708, 1.706, 1.703, 1.701, 1.699, 1.697
]

export const tScores80 = [
    3.078, 1.886, 1.638, 1.533, 1.476, 1.44, 1.415, 1.397, 1.383, 1.372, 1.363, 1.356, 1.35, 1.345, 1.341, 1.337,
    1.333, 1.33, 1.328, 1.325, 1.323, 1.321, 1.319, 1.318, 1.316, 1.315, 1.314, 1.313, 1.311, 1.31
]

export const calcSampleProps = (colNum:number, data:string[][]) => {
    const total = data.reduce((acc, row:string[], index:number) => {
        if(index === 0 || !row[colNum]) return acc
        acc.sum += Number(row[colNum])
        acc.n += 1
        return acc
    }, {sum: 0, n: 0})
    const avg = total.sum / total.n
    const x2Sum = data.reduce((sum:number, row:string[], index:number) => {
        if(index === 0 || !row[colNum]) return sum
        return sum += Math.pow(Number(row[colNum]) - avg, 2)
    }, 0)

    return {mean: avg, n: total.n, SD: Math.sqrt(x2Sum / (total.n - 1))}
}

export const calcTScore = (confidence:number, degFreedomIndex:number) => {
    console.log(confidence)
    if(confidence === .99) return tScores99[degFreedomIndex]
    if(confidence === .95) return tScores95[degFreedomIndex]
    if(confidence === .90) return tScores90[degFreedomIndex]
    if(confidence === .85) return tScores80[degFreedomIndex]
    console.log('what...')
    return 0
}

export const calcZScore = (confidence:number) => {
    console.log(confidence)
    if(confidence === .99) return 2.5758
    if(confidence === .95) return 1.960
    if(confidence === .90) return 1.6448
    if(confidence === .80) return 1.2815
    return 0
}

export default function OneSampleMean(info:IOneSampleCI['properties'], data:string[][]) {
    const sampleProps = info.inputMethod === 'manual' ? {mean: info.inputs.mean, n: info.inputs.sampleSize, SD: info.inputs.sampleSD} : calcSampleProps(info.inputs.datasetNum, data)
    const SE = Number(sampleProps.SD) / Math.sqrt(Number(sampleProps.n))
    const tScore = Number(sampleProps.n) - 2 >= 0 && Number(sampleProps.n) - 2 < 30 ? calcTScore(info.inputs.confidence, Number(sampleProps.n) - 2) : calcZScore(info.inputs.confidence)

    return {mean: sampleProps.mean, SE, interval: tScore * SE}
}