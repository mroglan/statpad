import {calcSampleProps, calcTScore, calcZScore} from './oneSampleMean'

export default function TwoSampleMean(info, data:string[][]) {

    const sample1Props = info.inputMethod === 'manual' ? {mean: info.inputs.mean1, n: info.inputs.sampleSize1, SD: info.inputs.sample1SD} : calcSampleProps(info.inputs.dataset1Num, data)
    const sample2Props = info.inputMethod === 'manual' ? {mean: info.inputs.mean2, n: info.inputs.sampleSize2, SD: info.inputs.sample2SD} : calcSampleProps(info.inputs.dataset2Num, data)
    const SE = Math.sqrt((Math.pow(sample1Props.SD, 2) / sample1Props.n) + (Math.pow(sample2Props.SD, 2) / sample2Props.n))
    const df = Number(info.inputs.sampleSize1) + Number(info.inputs.sampleSize2) - 2
    const tScore = df - 1 >= 0 && df - 1 < 30 ? calcTScore(info.inputs.confidence, df - 1) : calcZScore(info.inputs.confidence)

    return {mean: sample1Props.mean - sample2Props.mean, SE, interval: tScore * SE}
}

