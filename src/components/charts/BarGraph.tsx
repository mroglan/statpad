import {Bar} from 'react-chartjs-2'

interface BarGraphProps {
    data: any;
    properties: any;
    graphProperties: any;
}

interface ChartDataInterface {
    x: number;
    y: number;
}

export default function BarGraph({data, properties, graphProperties}: BarGraphProps) {

    const uniqueKey = () => Math.random()

    const chartData: ChartDataInterface[] = data.map((row:any, index:number) => {
        if(index === 0) return
        if(row[properties[0].y.num] !== 0 || row[properties[0].x.num] !== 0) if(!row[properties[0].x.num] || !row[properties[0].y.num]) return
        return {x: row[properties[0].x.num], y: row[properties[0].y.num]}
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

    const labels = chartData.map((point:ChartDataInterface) => point.x)
    const values = chartData.map((point:ChartDataInterface) => Number(point.y))

    const barGraphData = {
        labels,
        datasets: [{
            data: values,
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