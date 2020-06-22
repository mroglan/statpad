import BarGraph from '../../charts/BarGraph'
import {useState, useEffect, useMemo, useRef} from 'react'

const chartProperties = [{
    type: 'histogram',
    label: 'Result',
    x: {
        num: 0
    },
    y: {
        num: 1
    },
    options: {
        bar: {
            backgroundColor: '#BF3535',
            borderColor: '#E81515',
            borderWidth: 1
        }
    }
}]

const graphProperties = {
    axis: {
        titles: {
            color: '#fff'
        },
        ticks: {
            xMin: null,
            xMax: null,
            xScl: null,
            yMin: null,
            yMax: null,
            yScl: null
        }
    },
    graphTitle: {
        color: '#fff',
        title: 'Simulation Results'
    },
    legend: {
        display: false
    }
}

export default function SimGraph({output, lists, properties}) {

    const data = useRef<string[][]>()

    const getPossibleValuesForRange = (min:number, max:number) => {
        return Array(max - min + 1).fill(null).map((_, index:number) => index + min)
    }

    const getPossibleValuesForList = (listNum:number) => {
        return lists.map((row:string[], rowNum:number) => {
            if(rowNum === 0 || !row[listNum]) return
            return row[listNum]
        }).filter(el => el)
    }

    useMemo(() => {
        console.log(properties.inputType)
        const possibleValues = properties.inputType === 'range' ?  getPossibleValuesForRange(Number(properties.range.min), Number(properties.range.max)) : 
        getPossibleValuesForList(properties.datasetNum)
        
        const newData = possibleValues.map((value:string|number, index:number) => [
            value, output.reduce((total:number, result:string|number) => value === result ? total += 1 : total, 0) || 0.00001
        ])
        newData.unshift(['Outcome', 'Frequency'])
        //console.log('newData', newData)
        data.current = newData
    }, [output])

    return (
        <BarGraph data={data.current} properties={chartProperties} graphProperties={graphProperties} />
    )
}