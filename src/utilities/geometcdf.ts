import geometpdf from './geometpdf'

export default function geometcdf(successNum:number, prob:number) {
    return Array(successNum).fill(null).reduce((currentProb:number, _, index:number) => {
        return currentProb += geometpdf(index + 1, prob)
    }, 0)
}