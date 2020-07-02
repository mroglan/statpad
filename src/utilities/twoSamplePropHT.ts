import errorFunction from './errorFunction'
import {ITwoSampleHT} from '../components/projectComponents/projectInterfaces'

export default function twoSamplePropHT({inputs}:ITwoSampleHT['properties'], data:string[][]) {
    const p1 = Number(inputs.proportion1)
    const p2 = Number(inputs.proportion2)
    const n1 = Number(inputs.sampleSize1) 
    const n2 = Number(inputs.sampleSize2)

    const diff = p1 - p2
    const pc = ((p1 * n1) + (p2 * n2)) / (n1 + n2)

    const zScore = diff / Math.sqrt(((pc * (1 - pc)) / n1) + ((pc * (1 - pc)) / n2))

    const probToZero = (.5 -  (.5 * errorFunction(Math.abs(zScore) / Math.sqrt(2)))) * (inputs.comparison === 'notEqual' ? 2 : 1)

    const finalProb = inputs.comparison === 'notEqual' ? probToZero : inputs.comparison === 'less' && zScore > 0 ? 1 - probToZero : inputs.comparison === 'greater' && zScore < 0 ? 1 - probToZero : probToZero

    return {testStat1: p1, testStat2: p2, zScore, prob: finalProb}
}