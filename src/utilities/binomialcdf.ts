import factorial from './factorial'

export default function binomialcdf(trials:number, successes:number, prob:number) {
    const binomProb = Array(successes + 1).fill(null).reduce((currentProb:number, _, trialNum:number) => {
        const coef = factorial(trials) / (factorial(trialNum) * factorial(trials - trialNum) )
        return currentProb += coef * Math.pow(prob, trialNum) * Math.pow(1 - prob, trials - trialNum)
    }, 0)
    console.log(binomProb)
    return {coef: 'N/A', prob: binomProb}
}