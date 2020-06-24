

// const findProportion = (colNum:number, data:string[][]) => {
//     const total = data.reduce((acc, row:string[], index:number) => {
//         if(index === 0 || !row[colNum]) return acc
//         acc.sum += Number(row[colNum])
//         acc.n += 1
//         return acc
//     }, {sum: 0, n: 0})
//     return {p: total.sum / total.n, n: total.n}
// }

export default function OneSampleProportion(info, data:string[][]) {
    const prop:any =  Number(info.inputs.proportion)
    const SE =  Math.sqrt((prop * (1 - prop)) / info.inputs.sampleSize)
    const {confidence} = info.inputs
    const zScore = confidence === .99 ? 2.5758 : confidence === .95 ? 1.960 : confidence === .9 ? 1.6448 : confidence === .85 ? 1.4395 : confidence === .8 ? 1.2815 : 0
    
    return {prop, SE, interval: zScore * SE}
}

