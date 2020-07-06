import {useState, useMemo, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Box, Button, CircularProgress, Paper, IconButton, Typography} from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import Graph from '../graphSubs/Graph'
import MixedGraph from '../graphSubs/MixedGraph'
import Var1Stats from '../graphSubs/Var1Stats'
import { Snackbar } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close'
import {BaseGraph, InputData, Data, GraphComp} from '../projectInterfaces'

const useStyles = makeStyles(theme => ({
    newButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
        margin: theme.spacing(1)
    },
    spinner: {
        color: 'hsl(301, 77%, 40%)'
    },
    paper: {
        backgroundColor: 'hsl(241, 82%, 50%)',
        position: 'relative',
        marginBottom: '1rem'
    },
    '@keyframes appear': {
        '0%': {
            opacity: 0,
            transform: 'scale(0)',
        },
        '100%': {
            opacity: 1,
            transform: 'scale(1)',
        }
    },
    loadIn: {
        animation: '$appear 400ms'
    },
    deleteGraphButton: {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 12,
        color: theme.palette.error.dark,
        opacity: .5,
        '&:hover': {
            background: 'none',
            opacity: 1,
            transform: 'scale(1.1)'
        }
    },
    successMsg: {
        backgroundColor: theme.palette.success.main
    },
    errorMsg: {
        backgroundColor: theme.palette.error.main
    }
}))

const defalutMixedGraphProperties = {
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
        },
        x: 0,
        y: 1, 
        z: 1
    },
    graphTitle: {
        color: '#fff',
        title: null
    },
    legend: {
        display: false
    }
}

const defaultMixedCharts = [{
    type: 'scatter',
        label: null,
        options: {
            points: {
                color: '#E30F0F',
                radius: 3,
                maxRadius: 20
            },
            line: {
                color: '#2ea71b',
                width: 3,
                tension: 0.4
            },
            bar: {
                backgroundColor: '#BF3535',
                borderColor: '#E81515',
                borderWidth: 1
            }
        }
}]

const defaultGraphProperties = {
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
        title: null
    },
    legend: {
        display: false
    }
}

const defaultCharts = [{
    type: 'scatter',
    label: null,
    regressionType: null,
    regressionInfo: {
        a: null,
        b: null,
        r: null,
        r2: null
    },
    x: {
        num: 0
    },
    y: {
        num: 1
    },
    z: {
        num: 1
    },
    options: {
        points: {
            color: '#E30F0F',
            radius: 3,
            maxRadius: 20
        },
        line: {
            color: '#2ea71b',
            width: 3,
            tension: 0.4
        },
        bar: {
            backgroundColor: '#BF3535',
            borderColor: '#E81515',
            borderWidth: 1
        }
    }
}]

interface Props {
    component: GraphComp;
    data: InputData;
}

export default function Graphs({component, data}:Props) {

    const [graphs, setGraphs] = useState<BaseGraph[]>([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const syncedRef = useRef([])
    const sync = false

    const syncData = (index, success) => console.log('hello')

    useEffect(() => {
        const getComponents = async () => {
            setLoading(true)
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/getgraphs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(component)
            })
            const json = await res.json()
            setLoading(false)
            if(res.status !== 200) {
                setServerError(true)
            } else {
                syncedRef.current = json.map(el => false)
                setGraphs(json)
            }
        }
        getComponents()
    }, [component])

    const [formattedData, setFormattedData] = useState<Data>([])
    useMemo(() => {
        let data2 = []
        console.log('using memo....')
        const maxLength = data.reduce((max:number, current) => current.length > max ? max = current.length : max, 0)
        for(let i = 0; i < maxLength; i++) {
            let pushArray = []
            for(let j = 0; j < data.length; j++) {
                pushArray.push(data[j][i])
            }
            data2.push([].concat(...pushArray))
        }
        setFormattedData(data2)
    }, [data])

    const classes = useStyles()

    //console.log(sync)
    return (
        <div>
            
            {loading ? <div style={{marginBottom: '1.5rem'}}>
                <Grid container direction="row" alignItems="center" spacing={3}>
                    <Grid item>
                        <CircularProgress classes={{svg: classes.spinner}} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" style={{color: '#fff'}}>Loading...</Typography>
                    </Grid>
                </Grid>
            </div> : <Grid container direction="column">
                {graphs.map((graph, index:number) => {
                    //console.log(sync)
                    if(graph.type === 'graph') {
                        return (
                            <Paper key={index + sync.toString()} elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                <Graph rows={formattedData} initialGraph={graph}
                                syncData={syncData} sync={sync} index={index} basic={false} />
                            </Paper>
                        )
                    } if(graph.type === 'mixedGraph') {
                        console.log('mixed graph')
                        return (
                            <Paper key={index} elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                <MixedGraph rows={formattedData} initialGraph={graph}
                                syncData={syncData} sync={sync} index={index} basic={false} />
                            </Paper>
                        )
                    } if(graph.type === '1varStats') {
                        return (
                            <Paper key={index} elevation={3} className={`${classes.loadIn} ${classes.paper}`}>
                                <Var1Stats rows={formattedData} initialGraph={graph}
                                syncData={syncData} sync={sync} index={index} basic={false} />
                            </Paper>
                        )
                    }
                })}
            </Grid>}
        </div>
    )
}