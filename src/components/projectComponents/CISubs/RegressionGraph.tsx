import ScatterPlot from '../../charts/ScatterPlot'
import {Data} from '../projectInterfaces'

interface RegressionI {
    xNum: number;
    yNum: number;
    data: Data;
    info: {
        a: number;
        b: number;
    };
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
            z: {
                num: 0
            },
            regressionInfo: {
                a: 0,
                b: 0,
            },
            options: {
                points: {
                    color: '#E30F0F',
                    radius: 3,
                    maxRadius: 0
                },
                line: {
                    color: '#2ea71b',
                    width: 3,
                    tension: 0.4
                },
                bar: {
                    backgroundColor: '',
                    borderColor: '',
                    borderWidth: 0
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
            x: {
                num: xNum
            },
            y: {
                num: yNum
            },
            z: {
                num: 0
            },
            options: {
                line: {
                    color: '#2ea71b',
                    width: 3,
                    tension: 0.4
                },
                points: {
                    color: '',
                    radius: 0,
                    maxRadius: 0
                }, 
                bar: {
                    backgroundColor: '',
                    borderColor: '',
                    borderWidth: 0
                }
            }
        }
    ]

    return (
        <ScatterPlot data={data} graphProperties={graphProperties} properties={chartProperties} />
    )
}