

export default function twoSampleProp(info:any, data:string[][]) {
    const p1 = Number(info.inputs.proportion1)
    const p2 = Number(info.inputs.proportion2)
    const n1 = Number(info.inputs.sampleSize1)
    const n2 = Number(info.inputs.sampleSize2)
    const prop = ((p1 * 100000) - (p2 * 100000)) /100000
    const SE = Math.sqrt(((p1 * (1 - p1)) / n1) + ((p2 * (1 - p2)) / n2))
    const {confidence} = info.inputs
    const zScore = confidence === .99 ? 2.5758 : confidence === .95 ? 1.960 : confidence === .9 ? 1.6448 : confidence === .85 ? 1.4395 : confidence === .8 ? 1.2815 : 0

    return {prop, SE, interval: zScore * SE}
}