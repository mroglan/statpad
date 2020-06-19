import {useState, useMemo, useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Box, Button, CircularProgress, Paper, IconButton, Typography} from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import Graph from '../../components/Graph'
import MixedGraph from '../../components/MixedGraph'
import Var1Stats from '../../components/Var1Stats'
import { Snackbar } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close'

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

export default function Graphs({component, data}) {

    const [graphs, setGraphs] = useState([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [sync, setSync] = useState(false)
    const syncedRef = useRef([])
    const syncedCount = useRef(0)
    const [errorMsg, setErrorMsg] = useState(false)
    const [successMsg, setSuccessMsg] = useState(false)
    const [newGraph, setNewGraph] = useState(false)
    const [newMixedGraph, setNewMixedGraph] = useState(false)
    const [new1VarStats, setNew1VarStats] = useState(false)

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

    const [formattedData, setFormattedData] = useState([])
    useMemo(() => {
        let data2 = []
        console.log('using memo....')
        const maxLength = data.reduce((max:number, current:number[][]) => current.length > max ? max = current.length : max, 0)
        for(let i = 0; i < maxLength; i++) {
            let pushArray = []
            for(let j = 0; j < data.length; j++) {
                pushArray.push(data[j][i])
            }
            data2.push([].concat(...pushArray))
        }
        setFormattedData(data2)
    }, [data])

    const deleteGraph = async (index:number, id:string) => {
        const graphsCopy = [...graphs]
        graphsCopy.splice(index, 1)
        setGraphs(graphsCopy)
        await fetch(`${process.env.API_ROUTE}/projects/components/deletegraph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        })
    }

    //console.log(formattedData)

    const addToDatabase = async (newGraph, type) => {
        if(type === 'graph') setNewGraph(true)
        else if(type === 'mixedGraph') setNewMixedGraph(true)
        else if(type === '1varStats') setNew1VarStats(true)
        const res = await fetch(`${process.env.API_ROUTE}/projects/components/newgraph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGraph)
        })
        const json = await res.json()
        if(type === 'graph') setNewGraph(false)
        else if(type === 'mixedGraph') setNewMixedGraph(false)
        else if(type === '1varStats') setNew1VarStats(false)
        if(res.status !== 200) {
            setServerError(true)
            return
        }
        setGraphs([...graphs, newGraph])
    }

    const addGraph = async () => {
        const newGraph = {
            type: 'graph',
            component: component._id,
            properties: defaultGraphProperties,
            charts: defaultCharts
        }

        await addToDatabase(newGraph, 'graph')
    }

    const addMixedGraph = async () => {
        const newGraph = {
            type: 'mixedGraph',
            component: component._id,
            properties: defalutMixedGraphProperties,
            charts: defaultMixedCharts
        }

        await addToDatabase(newGraph, 'mixedGraph')
    }

    const add1VarStats = async () => {
        const newGraph = {
            type: '1varStats',
            component: component._id,
            properties: 0,
            charts: 0
        }

        await addToDatabase(newGraph, '1varStats')
    }

    const syncData = async (index:number, successful:boolean) => {
        syncedCount.current += 1
        if(successful) {
            syncedRef.current[index] = true
        }
        if(syncedCount.current === graphs.length) {
            console.log(syncedCount.current)
            syncedCount.current = 0
            setSync(false)
            if(syncedRef.current.includes(false)) {
                setErrorMsg(true)
                setSuccessMsg(false)
            } else {
                setSuccessMsg(true)
                setErrorMsg(false)
            }
        }
    }

    // const saveChanges = () => {
    //     setSync(true)
    //     setLoading(true)
    // }

    const classes = useStyles()

    //console.log(sync)
    return (
        <div>
            <Grid container direction="row" spacing={3} justify="center" style={{marginBottom: '1rem'}}>
                <Button variant="contained" className={classes.newButton} onClick={(e) => addGraph()}>
                    {newGraph ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New Graph'}
                </Button>
                <Button variant="contained" className={classes.newButton} onClick={(e) => addMixedGraph()}>
                    {newMixedGraph ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New Mixed Graph'}
                </Button>
                <Button variant="contained" className={classes.newButton} onClick={(e) => add1VarStats()}>
                    {new1VarStats ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : '1 Var Stats'}
                </Button>
            </Grid>

            <Grid container justify="center" style={{marginBottom: '1.5rem'}}>
                <Button variant="contained" className={classes.newButton} onClick={(e) => setSync(true)} >
                    {sync ? <Grid container alignItems="center" ><CircularProgress classes={{svg: classes.spinner}} size={20} /> Saving</Grid> : 'Save Changes'}
                </Button>
            </Grid>
            
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
                                <IconButton disableRipple aria-label="remove regression" className={classes.deleteGraphButton}
                                onClick={(e) => deleteGraph(index, graph._id)} >
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <Graph rows={formattedData} initialGraph={graph}
                                syncData={syncData} sync={sync} index={index} basic={false} />
                            </Paper>
                        )
                    } if(graph.type === 'mixedGraph') {
                        console.log('mixed graph')
                        return (
                            <Paper key={index} elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                <IconButton disableRipple aria-label="remove regression" className={classes.deleteGraphButton}
                                onClick={(e) => deleteGraph(index, graph._id)} >
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <MixedGraph rows={formattedData} initialGraph={graph}
                                syncData={syncData} sync={sync} index={index} basic={false} />
                            </Paper>
                        )
                    } if(graph.type === '1varStats') {
                        return (
                            <Paper key={index} elevation={3} className={`${classes.loadIn} ${classes.paper}`}>
                                <IconButton disableRipple aria-label="remove regression" className={classes.deleteGraphButton}
                                onClick={(e) => deleteGraph(index, graph._id)} >
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <Var1Stats rows={formattedData} initialGraph={graph}
                                syncData={syncData} sync={sync} index={index} basic={false} />
                            </Paper>
                        )
                    }
                })}
            </Grid>}
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} open={successMsg} onClose={(e) => setSuccessMsg(false)}
            message="Changes saved" autoHideDuration={6000} ContentProps={{classes: {
                root: classes.successMsg
            }}} action={
                <IconButton size="small" aria-label="close" onClick={(e) => setSuccessMsg(false)} style={{color: '#fff'}} >
                    <CloseIcon />
                </IconButton>
            } />
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} open={errorMsg} onClose={(e) => setErrorMsg(false)}
            message="Error saving" autoHideDuration={6000} ContentProps={{classes: {
                root: classes.errorMsg
            }}} action={
                <IconButton size="small" aria-label="close" onClick={(e) => setErrorMsg(false)} style={{color: '#fff'}}>
                    <CloseIcon />
                </IconButton>
            } />
        </div>
    )
}