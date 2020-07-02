import errorFunction from './errorFunction'
import {calcSampleProps} from './oneSampleMean'
import {IOneSampleHT} from '../components/projectComponents/projectInterfaces'

export default function oneSampleMeanHT(info:IOneSampleHT['properties'], data:string[][]) {
    const {inputs} = info
    const Ho = Number(inputs.nullH)

    const sampleInfo = info.inputMethod === 'manual' ? {n: Number(inputs.sampleSize), mean: Number(inputs.mean), SD: Number(inputs.sampleSD)} : calcSampleProps(inputs.datasetNum, data)
    const SE = sampleInfo.SD / Math.sqrt(sampleInfo.n)
    const zScore = (sampleInfo.mean - Ho) / SE
    const probToZero = (.5 -  (.5 * errorFunction(Math.abs(zScore) / Math.sqrt(2)))) * (inputs.comparison === 'notEqual' ? 2 : 1)

    const finalProb = inputs.comparison === 'notEqual' ? probToZero : inputs.comparison === 'less' && zScore > 0 ? 1 - probToZero : inputs.comparison === 'greater' && zScore < 0 ? 1 - probToZero : probToZero


    return {prob: finalProb, zScore, testStat: sampleInfo.mean}
}