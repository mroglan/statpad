import {Scatter} from 'react-chartjs-2'

interface NormalCurveI {
    mean:number;
    SD:number;
    range:number
    confidence:number;
    name: string;
}

const chartProperties = [{
    
}]

export default function NormalCurveCI({mean, SD, range, confidence, name}:NormalCurveI) {

    const calcYValue = (xVal:number) => {
        const factor = 1 / (SD * Math.sqrt(2 * Math.PI))
        return factor * Math.exp(-Math.pow(xVal - mean, 2) / (2 * Math.pow(SD, 2)))
    }

    const calcXValues = (min:number, max:number, len:number) => {
        let returnArray = []
        const step = (max - min) / len
        if(step <= 0) return []
        for(let i = 0; i < len; i ++) {
            returnArray.push(min + (i * step))
        }
        //console.log(returnArray)
        return returnArray
    }

    console.log(range)

    const withinCIXVals = calcXValues(mean - range, mean + range, confidence * 1000)
    const withinCIVals = withinCIXVals.map((val:number) => ({x: val, y: calcYValue(val)}))

    const upperBound = (4 * SD) + mean
    const lowerBound = mean - (4 * SD)

    const lowerXVals = calcXValues(lowerBound, mean - range, (1 - confidence) * 1000)
    const lowerVals = lowerXVals.map((val:number) => ({x: val, y: calcYValue(val)}))

    const upperXVals = calcXValues(mean + range, upperBound, (1 - confidence) * 1000)
    const upperVals = upperXVals.map((val:number) => ({x: val, y: calcYValue(val)}))

    console.log('within ci', withinCIVals)
    console.log('upper', upperVals)
    console.log('lower', lowerVals)

    const plotData = [
        {
            data: withinCIVals,
            label: 'Within CI',
            pointBackgroundColor: 'hsl(116, 73%, 40%)',
            showLine: true,
            borderColor: 'hsl(116, 73%, 40%)',
            backgroundColor: 'hsl(116, 73%, 40%)',
            borderWidth: 3,
            fill: true,
            pointRadius: 0.1,
            pointBorderWidth: 0
        },
        {
            data: upperVals,
            label: 'Above CI',
            pointBackgroundColor: 'hsl(0, 84%, 49%)',
            showLine: true,
            borderColor: 'hsl(0, 84%, 49%)',
            backgroundColor: 'hsl(0, 84%, 49%)',
            borderWidth: 3,
            fill: true,
            pointRadius: 0.1,
            pointBorderWidth: 0
        },
        {
            data: lowerVals,
            label: 'Below CI',
            pointBackgroundColor: 'hsl(0, 84%, 49%)',
            showLine: true,
            borderColor: 'hsl(0, 84%, 49%)',
            backgroundColor: 'hsl(0, 84%, 49%)',
            borderWidth: 3,
            fill: true,
            pointRadius: 0.1,
            pointBorderWidth: 0
        }
    ]

    const graphOptions:any = {
        responsive: true,
        animation: {
            duration: 0
        },
        responsiveAnimationDuration: 0,
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "#fff",
                    beginAtZero: false,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Frequency',
                    fontColor: '#fff',
                    fontSize: 20
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: "#fff",
                    beginAtZero: false
                },
                scaleLabel: {
                    display: true,
                    labelString: name,
                    fontColor: '#fff',
                    fontSize: 20
                }
            }]
        },
        title: {
            display: true,
            text: 'Normal Distribution',
            fontColor: '#fff',
            fontSize: 25
        }
    }

    const keyProvider = () => Math.random()

    return (
        <div>
            <div style={{position: 'relative'}}>
                <Scatter options={graphOptions} data={{datasets: plotData}} datasetKeyProvider={keyProvider} />
            </div>
        </div>
    )
}