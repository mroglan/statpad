import errorFunction from './errorFunction'
import {IOneSampleHT} from '../components/projectComponents/projectInterfaces'

export default function oneSamplePropHT({inputs}:IOneSampleHT['properties'], data:string[][]) {
    const Ho = Number(inputs.nullH)
    const n = Number(inputs.sampleSize)
    const p = Number(inputs.proportion)

    const SD = Math.sqrt((Ho * (1 - Ho)) / n)
    const zScore = (p - Ho) / SD
    const probToZero = (.5 -  (.5 * errorFunction(Math.abs(zScore) / Math.sqrt(2)))) * (inputs.comparison === 'notEqual' ? 2 : 1)

    const finalProb = inputs.comparison === 'notEqual' ? probToZero : inputs.comparison === 'less' && zScore > 0 ? 1 - probToZero : inputs.comparison === 'greater' && zScore < 0 ? 1 - probToZero : probToZero

    //console.log(finalProb)
    return {prob: finalProb, zScore, testStat: p}
}