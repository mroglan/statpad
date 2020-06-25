import ScatterPlot from '../../charts/ScatterPlot'

interface RegressionI {
    xNum:number;
    yNum:number;
    data:string[][];
    info:any;
}

const graphProperties = {
    axis: {
        titles: {
            color: '#fff'
        },
        ticks: {
            xMin: null,
            xMax: null,
            xScl: null,
            yMin: '0',
            yMax: null,
            yScl: null
        }
    },
    graphTitle: {
        color: '#fff',
        title: 'Regression'
    },
    legend: {
        display: false
    }
}

export default function RegressionGraph({xNum, yNum, data, info}:RegressionI) {

    const chartProperties = [
        {
            type: 'scatter',
            label: 'Input Data',
            x: {
                num: xNum
            },
            y: {
                num: yNum
            },
            options: {
                points: {
                    color: '#E30F0F',
                    radius: 3
                },
                line: {
                    color: '#2ea71b',
                    width: 3,
                    tension: 0.4
                }
            }
        },
        {
            type: 'regression',
            label: 'Regression',
            regressionType: 'linear',
            regressionInfo: {
                a: info.a,
                b: info.b
            },
            options: {
                line: {
                    color: '#2ea71b',
                    width: 3,
                    tension: 0.4
                }
            }
        }
    ]

    return (
        <ScatterPlot data={data} graphProperties={graphProperties} properties={chartProperties} />
    )
}