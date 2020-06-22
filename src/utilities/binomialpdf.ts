import factorial from './factorial'

export default function binomialpdf(trials:number, successes:number, prob:number) {
    const coef = factorial(trials) / (factorial(successes) * factorial(trials - successes))

    return coef * Math.pow(prob, successes) * Math.pow(1 - prob, trials - successes)
}