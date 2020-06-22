import BarGraph from '../../charts/BarGraph'
import binomialpdf from '../../../utilities/binomialpdf'
import {useMemo, useRef} from 'react'

const chartProperties = [{
    type: 'histogram',
    label: 'Probability',
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
        title: 'Binomial Distribution'
    },
    legend: {
        display: false
    }
}

export default function BinomialGraph({trials, probability}) {

    const possibleValues:any = useMemo(() => {
        return Array(trials + 1).fill(null).map((_, index:number) => index)
    }, [trials])

    const probsArray = possibleValues.map((val:number) => [
        val.toString(), binomialpdf(trials, val, probability) || 0.0000000001
    ])

    probsArray.unshift(['Number of Successes', 'Probability'])

    return (
        <BarGraph data={probsArray} properties={chartProperties} graphProperties={graphProperties} />
    )
}