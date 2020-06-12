

export default function calc1VarStats(list: number[]) {

    const n = list.length
    const mean = list.reduce((sum:number, item:number) => sum += item, 0) / n
    const sortedList = list.sort((a, b) => a - b)
    const median = (n - 1) % 2 === 0 ? sortedList[(n - 1)/2] : (sortedList[(n - 1)/2 + .5] + sortedList[(n - 1)/2 - .5]) / 2
    const findMode = (list:number[]) => {
        const reducedList = list.reduce((info, item) => {
            info.numMapping[item] = (info.numMapping[item] || 0) + 1
            const val = info.numMapping[item]
            if(val > info.greatestFreq) {
                info.greatestFreq = val
                info.mode = item
                info.duplicates = []
            } else if(val === info.greatestFreq) {
                info.duplicates.push(item)
            }
            return info
        }, {mode: null, greatestFreq: 0, numMapping: {}, duplicates: []})
        
        return reducedList.duplicates.length === 0 ? reducedList.mode : 'none'
    }
    const mode = findMode(list)

    const min = list.reduce((min:number, item:number) => item < min ? min = item : min, Infinity)
    const max = list.reduce((max:number, item:number) => item > max ? max = item : max, -Infinity)

    const q1Array = (n - 1) % 2 === 0 ? sortedList.slice(0, (n - 1) / 2) : sortedList.slice(0, Math.ceil((n - 1) / 2))
    const q1Len = q1Array.length
    const q1 = (q1Len - 1) % 2 === 0 ? q1Array[(q1Len - 1)/2] : (q1Array[(q1Len - 1)/2 + .5] + q1Array[(q1Len - 1)/2 - .5]) / 2

    const q3Array = (n - 1) % 2 === 0 ? sortedList.slice(((n - 1) / 2) + 1) : sortedList.slice(Math.ceil((n - 1) / 2))
    const q3Len = q3Array.length
    const q3 = (q3Len - 1) % 2 === 0 ? q3Array[(q3Len - 1)/2] : (q3Array[(q3Len - 1)/2 + .5] + q3Array[(q3Len - 1)/2 - .5]) / 2

    const diffSum = list.reduce((sum:number, item:number) => sum += Math.pow(item - mean, 2), 0)
    const sampleStd = Math.sqrt(diffSum / (n - 1))
    const popStd = Math.sqrt(diffSum / n)

    //console.log({mean, median, mode, min, max, q1, q2, sampleStd, popStd})

    return {mean, median, mode, min, max, q1, q3, sampleStd, popStd}
}