import {Scatter, Bar, Pie, Polar, Bubble} from 'react-chartjs-2'

interface GraphProps {
    data: any;
    properties: any;
    graphProperties: any;
}

interface ChartDataInterface {
    x: number;
    y: number;
    r: number;
}

export default function MixedGraph({data, properties, graphProperties}: GraphProps) {

    const uniqueKey = () => Math.random()

    const chartData: ChartDataInterface[] = data.map((row:any, index:number) => {
        if(index === 0) return
        if(!row[graphProperties.axis.x] || !row[graphProperties.axis.y]) return
        return {x: row[graphProperties.axis.x], y: row[graphProperties.axis.y], r: Number(row[graphProperties.axis.z])}
    }).filter((dataPoint: ChartDataInterface) => dataPoint)

    const maxZ = chartData.reduce((max:number, point:ChartDataInterface) => point.r > max ? max = point.r : max, 0)

    const labels = chartData.map((point:ChartDataInterface) => point.x)
    const values = chartData.map((point:ChartDataInterface) => Number(point.y))
    const scatterData = chartData.map((point:ChartDataInterface) => {
        return {x: Number(point.x), y: Number(point.y)}
    })

    const graphOptions:any = {
        responsive: true,
        animation: {
            duration: 0
        },
        responsiveAnimationDuration: 0,
        legend: {
            display: false,
            labels: {
                fontColor: '#fff'
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: '#fff'
                },
                scaleLabel: {
                    display: true,
                    labelString: data[0][graphProperties.axis.x] || 'no title',
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
                    labelString: data[0][graphProperties.axis.y] || 'no title',
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

    const datasets = properties.map((property:any) => {
        if(!property) return
        if(property.type === 'scatter' || property.type === 'line') {
            return {
                data: property.type === 'line' ? values : scatterData,
                label: property.label,
                type: 'scatter',
                pointBackgroundColor: property.options.points.color,
                showLine: property.type === 'line',
                borderColor: property.options.line.color,
                pointBorderColor: property.options.points.color,
                fill: false,
                borderWidth: Number(property.options.line.width) || 3,
                pointRadius: Number(property.options.points.radius) || 3,
                pointBorderWidth: 1,
                pointHoverRadius: Number(property.options.points.radius) * 4/3 || 4,
                lineTension: property.options.line.tension 
            }
        } if(property.type === 'bar' || property.type === 'histogram') {
            return {
                data: values,
                label: property.label,
                type: 'bar',
                backgroundColor: property.options.bar.backgroundColor,
                borderColor: property.options.bar.borderColor,
                borderWidth: Number(property.options.bar.borderWidth),
                barPercentage: property.type === 'bar' ? .9 : 1.25
            }
        } if(property.type === 'bubble') {
            const scaledChartData = chartData.map((point:ChartDataInterface) =>{
                return {...point, r: (point.r / maxZ) * property.options.points.maxRadius}
            })
            return {
                data: scaledChartData,
                type: 'bubble',
                label: property.label,
                backgroundColor: property.options.points.color
            }
        }
    })

    const graphData = {
        labels, 
        datasets
    }

    console.log(graphData)

    return (
        <div>
            <div style={{position: 'relative'}}>
                {properties[0].type === 'scatter' ? <Scatter options={graphOptions} data={graphData} datasetKeyProvider={uniqueKey} /> : ''}
                {properties[0].type === 'bar' || properties[0].type === 'histogram' || properties[0].type === 'line' ? <Bar options={graphOptions} data={graphData} datasetKeyProvider={uniqueKey} /> : ''}
                {properties[0].type === 'bubble' && <Bubble options={graphOptions} data={graphData} datasetKeyProvider={uniqueKey} />}
            </div>
        </div>
    )
}