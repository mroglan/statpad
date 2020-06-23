

export default function geometpdf(successNum:number, prob:number) {
    return Math.pow(1 - prob, successNum - 1) * prob
}