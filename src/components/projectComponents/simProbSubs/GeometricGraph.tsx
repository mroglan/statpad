import BarGraph from '../../charts/BarGraph'
import geometpdf from '../../../utilities/geometpdf'


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
        title: 'Geometric Distribution'
    },
    legend: {
        display: false
    }
}

export default function GeometricGraph({probability}) {

    const findValues = (probability:number) => {
        let value = Infinity
        const valuesArray = []
        while(value > 0.01 || valuesArray.length < 5) {
            value = geometpdf(valuesArray.length + 1, probability)
            valuesArray.push([(valuesArray.length + 1).toString(), value])
        }
        return valuesArray
    }

    const values = findValues(probability)
    values.unshift(['First Success', 'Probability'])

    console.log(values)

    return (
        <BarGraph data={values} properties={chartProperties} graphProperties={graphProperties} />
    )
}