import {Bar, Scatter} from 'react-chartjs-2'

interface HistogramProps {
    data: any;
    properties: any;
    graphProperties: any;
}

interface ChartDataInterface {
    x: number;
    y: number;
}

export default function Histogram({data, properties, graphProperties}: HistogramProps) {

    const uniqueKey = () => Math.random()

    const chartData: ChartDataInterface[] = data.map((row:any, index:number) => {
        if(index === 0) return
        if(!row[properties[0].x.num] || !row[properties[0].y.num]) return
        return {x: Number(row[properties[0].x.num]), y: Number(row[properties[0].y.num])}
    }).filter((dataPoint: ChartDataInterface) => dataPoint)

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
            xAxes: [{
                ticks: {
                    fontColor: '#fff'
                },
                scaleLabel: {
                    display: true,
                    labelString: data[0][properties[0].y.num] || 'no title',
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

    const labels = chartData.map((point:ChartDataInterface) => point.x)
    const values = chartData.map((point:ChartDataInterface) => Number(point.y))

    const minFound = chartData.reduce((min:number, dataPoint:ChartDataInterface) => dataPoint.x < min ? min = dataPoint.x : min, 10000000000000)
    const min = minFound < 0 ? minFound : 0
    const max = chartData.reduce((max:number, dataPoint:ChartDataInterface) => dataPoint.x > max ? max = dataPoint.x : max, 0)
    
    const findExcess = () => {
        if((max-min) <= 10) return 1
        else if((max-min) <= 100) return 10
        else if((max-min) <= 200) return 20
        else if((max-min) <= 500) return 50
        else if((max-min) <= 1000) return 100
        else if((max-min) <= 2000) return 200
        else if((max-min) <= 5000) return 500
        else if((max-min) <= 10000) return 1000
        else if((max-min) <= 20000) return 2000
        else if((max-min) <= 50000) return 5000
        else if((max-min) <= 100000) return 10000
        else return 0
    }
    const excess = findExcess()

    let graphMin = min, graphMax = max;

    if(graphProperties.axis.ticks.xMin) {
        graphMin = Number(graphProperties.axis.ticks.xMin)
    } else {
        for(let i = 0; i < excess; i++) {
            if((min - i) % excess === 0) {
                graphMin = min - i
                break
            }
        }
    }

    if(graphProperties.axis.ticks.xMax) {
        graphMax = graphProperties.axis.ticks.xMax
    } else {
        for(let i = 0; i < excess; i++) {
            if((max + i) % excess === 0) {
                graphMax = max + i
                break
            }
        }
    }

    const range = (min:number, max:number) => {
        let returnArray = []
        const step = (max - min) / 1000
        if(step <= 0) return []
        for(let i = 0; i < 1000; i ++) {
            returnArray.push(min + (i * step))
        }
        //console.log(returnArray)
        return returnArray
    } 

    const xValues: any = range(graphMin, graphMax)

    const regressions = properties.map((property, index) => {
        if(property.type !== 'regression') return
        const a = property.regressionInfo.a
        const b = property.regressionInfo.b
        const c = property.regressionInfo.c
        const d = property.regressionInfo.d
        const e = property.regressionInfo.e
        // console.log('a', a)
        // console.log('b', b)
        const regressionValues = xValues.map(x => {
            if(property.regressionType === 'linear') return {x: x, y: ((a * x) + b)}
            if(property.regressionType === 'quadratic') return {x: x, y: ((a * Math.pow(x, 2)) + (b * x) + c)}
            if(property.regressionType === 'cubic') return {x: x, y: ((a * Math.pow(x, 3)) + (b * Math.pow(x, 2)) + (c * x) + d)}
            if(property.regressionType === 'quartic') return {x: x, y: ((a * Math.pow(x, 4)) + (b * Math.pow(x, 3)) + (c * Math.pow(x, 2)) + (d * x) + e)}
            if(property.regressionType === 'ln') return {x: x, y: ((a * Math.log(x)) + b)}
            if(property.regressionType === 'exponential') return {x: x, y: a * Math.pow(Math.E, b * x)}
            if(property.regressionType === 'power') return {x: x, y: a * Math.pow(x, b)}
        })
        //console.log('regressionValues', regressionValues)
        return {data: regressionValues, 
            type: 'line', 
            label: property.label || 'none', 
            fill: false,
            backgroundColor: property.options.line.color,
            borderWidth: property.options.line.width,
            borderColor: property.options.line.color,
            pointRadius: 0.1,
            pointBorderWidth: 0,
            showLine: true,
        }
    }).filter(property => property)

    const histogramData = {
        labels,
        datasets: [{
            data: values,
            label: properties[0].label,
            barPercentage: 1.25,
            backgroundColor: properties[0].options.bar.backgroundColor,
            borderColor: properties[0].options.bar.borderColor,
            borderWidth: Number(properties[0].options.bar.borderWidth),
        }, ...regressions]
    }

    return (
        <div>
            <div style={{position: 'relative'}}>
                <Scatter options={graphOptions} data={histogramData} datasetKeyProvider={uniqueKey} />
            </div>
        </div>
    )
}