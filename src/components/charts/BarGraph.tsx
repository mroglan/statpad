import {Bar} from 'react-chartjs-2'
import {ChartDataInterface, PlotProps, BarAndHistogramGraphOptions} from './chartInterfaces'

const barNum = 10

export default function BarGraph({data, properties, graphProperties}: PlotProps) {

    const uniqueKey = () => Math.random()

    const chartData: ChartDataInterface[] = data.map((row:any, index:number) => {
        if(index === 0) return
        if(row[properties[0].y.num] !== 0 || row[properties[0].x.num] !== 0) if(!row[properties[0].x.num] || !row[properties[0].y.num]) return
        return {x: row[properties[0].x.num], y: row[properties[0].y.num]}
    }).filter((dataPoint: ChartDataInterface) => dataPoint)

    const sortedHistogramData:ChartDataInterface[] = chartData.map(({x, y}) => ({x: Number(x), y: Number(y)})).sort((p1, p2) => p1.x - p2.x) // sort in ascending order

    const histDataMin = sortedHistogramData[0].x
    const histDataMax = sortedHistogramData[sortedHistogramData.length - 1].x

    const intervalMin = histDataMin // Math.floor(histDataMin / 10) * 10
    const intervalMax = histDataMax + ((histDataMax - histDataMin) / barNum) // (Math.ceil(histDataMax / 10) * 10) + (Number.isInteger(histDataMax / 10) ? 10 : 0)

    const interval = properties[0].options.bar.interval ? Number(properties[0].options.bar.interval) : (intervalMax - intervalMin) / barNum

    const ranges:{min:number, max:number}[] = []

    for(let i = 0; Number((((i + 1) * interval) + intervalMin).toFixed(2)) < intervalMax + interval; i++) {
        ranges.push({min: Number(((i * interval) + intervalMin).toFixed(2)), max: Number((((i + 1) * interval) + intervalMin).toFixed(2))})
    }

    const histData = ranges.map(({min, max}) => {
        const sum = sortedHistogramData.reduce((total, point) => {
            if(point.x >= min && point.x < max) {
                return total += point.y
            }
            return total
        }, 0)
        return {x: `[${min}, ${max})`, y: sum}
    })

    console.log(histData)


    const graphOptions:BarAndHistogramGraphOptions = {
        responsive: true,
        animation: {
            duration: 0
        },
        responsiveAnimationDuration: 0,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: '#fff'
                },
                scaleLabel: {
                    display: true,
                    labelString: data[0][properties[0].x.num] || 'no title',
                    fontColor: '#fff',
                    fontSize: 20
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: '#fff',
                    beginAtZero: graphProperties.axis.ticks.yMin ? false : true,
                    min: graphProperties.axis.ticks.yMin !== '0' && !Number(graphProperties.axis.ticks.yMin) ? undefined : Number(graphProperties.axis.ticks.yMin),
                    max: graphProperties.axis.ticks.yMax !== '0' && !Number(graphProperties.axis.ticks.yMax) ? undefined : Number(graphProperties.axis.ticks.yMax),
                    stepSize: Number(graphProperties.axis.ticks.yScl) || undefined
                },
                scaleLabel: {
                    display: true,
                    labelString: data[0][properties[0].y.num] || 'no title',
                    fontColor: '#fff',
                    fontSize: 20
                }
            }]
        },
        title: {
            display: true,
            text: graphProperties.graphTitle.title || 'My Graph',
            fontColor: '#fff',
            fontSize: 25
        }
    }

    const barLabels = chartData.map((point:ChartDataInterface) => point.x)
    const barValues = chartData.map((point:ChartDataInterface) => Number(point.y))

    const histLabels = histData.map((point) => point.x)
    const histValues = histData.map(point => point.y)

    const barGraphData = {
        labels: properties[0].type === 'bar' ? barLabels : histLabels,
        datasets: [{
            data: properties[0].type === 'bar' ? barValues : histValues,
            label: properties[0].label,
            backgroundColor: properties[0].options.bar.backgroundColor,
            borderColor: properties[0].options.bar.borderColor,
            borderWidth: Number(properties[0].options.bar.borderWidth),
            barPercentage: properties[0].type === 'bar' ? .9 : 1.25
        }]
    }

    return (
        <div>
            <div style={{position: 'relative'}}>
                <Bar options={graphOptions} data={barGraphData} datasetKeyProvider={uniqueKey} />
            </div>
        </div>
    )
}