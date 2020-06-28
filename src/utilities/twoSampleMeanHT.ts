import {calcSampleProps} from './oneSampleMean'
import errorFunction from './errorFunction'

export default function twoSampleMeanHT(info, data:string[][]) {

    const sample1Props = info.inputMethod === 'manual' ? {mean: info.inputs.mean1, n: info.inputs.sampleSize1, SD: info.inputs.sampleSD1} : calcSampleProps(info.inputs.datasetNum1, data)
    const sample2Props = info.inputMethod === 'manual' ? {mean: info.inputs.mean2, n: info.inputs.sampleSize2, SD: info.inputs.sampleSD2} : calcSampleProps(info.inputs.datasetNum2, data)

    //console.log('sample1props', sample1Props)
    const diff = sample1Props.mean - sample2Props.mean

    const tScore = diff / Math.sqrt((Math.pow(sample1Props.SD, 2) / sample1Props.n) + (Math.pow(sample2Props.SD, 2) / sample2Props.n))

    const probToZero = (.5 -  (.5 * errorFunction(Math.abs(tScore) / Math.sqrt(2)))) * (info.inputs.comparison === 'notEqual' ? 2 : 1)

    const finalProb = info.inputs.comparison === 'notEqual' ? probToZero : info.inputs.comparison === 'less' && tScore > 0 ? 1 - probToZero : info.inputs.comparison === 'greater' && tScore < 0 ? 1 - probToZero : probToZero

    return {testStat1: sample1Props.mean, testStat2: sample2Props.mean, zScore: tScore, prob: finalProb}
}