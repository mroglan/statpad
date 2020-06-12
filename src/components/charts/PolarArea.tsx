import {Polar} from 'react-chartjs-2'

interface PolarAreaProps {
    data: any;
    properties: any;
    graphProperties: any;
}

interface ChartDataInterface {
    x: number;
    y: number;
}

export default function PolarArea({data, properties, graphProperties}: PolarAreaProps) {

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
            display: true,
            labels: {
                fontColor: '#fff'
            }
        },
        title: {
            display: true,
            text: graphProperties.graphTitle.title || 'My Graph',
            fontColor: '#fff',
            fontSize: 25
        },
        scale: {
            ticks: {
                display: false
            }
        }
    }

    const labels = chartData.map((point:ChartDataInterface) => point.x)
    const values = chartData.map((point:ChartDataInterface) => Number(point.y))

    const backgroundColors = [
        '#FE1717', '#32D553', '#BDD717', '#D02CD5', '#1AD7DE', '#3C7119', '#CBE2D6', '#4C902A'
    ]

    const pieChartData = {
        labels,
        datasets: [{
            data: values,
            label: properties[0].label,
            backgroundColor: backgroundColors
        }]
    }

    return (
        <div>
            <div style={{position: 'relative'}}>
                <Polar options={graphOptions} data={pieChartData} datasetKeyProvider={uniqueKey} />
            </div>
        </div>
    )
}