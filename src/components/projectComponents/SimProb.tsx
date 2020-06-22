import {useState, useEffect, useRef, useMemo} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Button, CircularProgress, Typography, Paper, IconButton, Snackbar, Box} from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import TreeDiagram from './simProbSubs/TreeDiagram'
import CloseIcon from '@material-ui/icons/Close'
import TwoWayTable from './simProbSubs/TwoWayTable'
import Simulation from './simProbSubs/Simulation'

interface TestI {
    type: string;
    data: any;
}

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
    deleteTestButton: {
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
    },
    scrollX: {
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
            width: 10
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'hsl(241, 82%, 60%)',
            borderRadius: '.3rem',
            '&:hover': {
                background: 'hsl(241, 82%, 57%)'
            }
        }
    }
}))

const defaultTreeDiagramData = {
    name: '',
    probability: '1',
    children: [
        {name: '', probability: '0.5', children: []}, {name: '', probability: '0.5', children: []}
    ]
}

const defaultTwoWayTableData = [
    [null, '', ''],
    ['', '', ''],
    ['', '', '']
]

const defaultTwoWayTableProperties = {
    horzTitle: '',
    verticalTitle: '',
    displayTotals: false,
    contentType: 'frequency'
}

const defaultSimulationData = {
    output: []
}

const defaultSimulationProperties = {
    trials: '0',
    inputType: 'range',
    range: {
        min: '0',
        max: '0'
    },
    datasetNum: 0,
    displayGraph: false
}

export default function SimProb({component, data}) {

    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [sync, setSync] = useState(false)
    const syncedRef = useRef([])
    const syncedCount = useRef(0)
    const [errorMsg, setErrorMsg] = useState(false)
    const [successMsg, setSuccessMsg] = useState(false)
    const [newTestLoading, setNewTestLoading] = useState({
        treeDiagram: false,
        twoWayTable: false,
        simulation: false,
        binomial: false,
        geometric: false
    })

    useEffect(() => {
        const getComponents = async () => {
            setLoading(true)
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/gettests`, {
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
                setTests(json)
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

    const syncData = async (index:number, successful:boolean) => {
        syncedCount.current += 1
        if(successful) {
            syncedRef.current[index] = true
        }
        if(syncedCount.current === tests.length) {
            console.log(syncedCount.current)
            syncedCount.current = 0
            setSync(false)
            if(syncedRef.current.includes(false)) {
                syncedRef.current = syncedRef.current.map(el => false)
                setErrorMsg(true)
            } else {
                syncedRef.current = syncedRef.current.map(el => false)
                setSuccessMsg(true)
            }
        }
    }

    const deleteTest = async (index:number, id:string) => {
        const testsCopy = [...tests]
        testsCopy.splice(index, 1)
        syncedRef.current.splice(index, 1)
        setTests(testsCopy)
        await fetch(`${process.env.API_ROUTE}/projects/components/deletetest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        })
    }

    const addToDatabase = async (newTest:TestI, type:string) => {
        if(type === 'treeDiagram') setNewTestLoading({...newTestLoading, treeDiagram: true})
        else if(type === 'twoWayTable') setNewTestLoading({...newTestLoading, twoWayTable: true})
        else if(type === 'simulation') setNewTestLoading({...newTestLoading, simulation: true})

        const res = await fetch(`${process.env.API_ROUTE}/projects/components/newtest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTest)
        })
        const json = await res.json()

        if(type === 'treeDiagram') setNewTestLoading({...newTestLoading, treeDiagram: false})
        else if(type === 'twoWayTable') setNewTestLoading({...newTestLoading, twoWayTable: false})
        else if(type === 'simulation') setNewTestLoading({...newTestLoading, simulation: false})

        if(res.status !== 200) {
            setServerError(true)
            return
        }
        syncedRef.current.push(false)
        setTests([...tests, json])
    }

    const createTreeDiagram = async () => {
        const newDiagram = {
            component: component._id,
            type: 'treeDiagram',
            data: defaultTreeDiagramData,
            properties: 0
        }

        await addToDatabase(newDiagram, 'treeDiagram')
    }

    const createTwoWayTable = async () => {
        const newTable = {
            component: component._id,
            type: 'twoWayTable',
            data: defaultTwoWayTableData,
            properties: defaultTwoWayTableProperties
        }

        await addToDatabase(newTable, 'twoWayTable')
    }

    const createSimulation = async () => {
        const newSimulation = {
            component: component._id,
            type: 'simulation',
            data: defaultSimulationData,
            properties: defaultSimulationProperties
        }

        await addToDatabase(newSimulation, 'simulation')
    }

    const classes = useStyles()
    return (
        <div>
            <Grid container direction="row" spacing={3} justify="center" style={{marginBottom: '1rem'}}>
                <Button variant="contained" className={classes.newButton} onClick={(e) => createTreeDiagram()} >
                    {newTestLoading.treeDiagram ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New Tree Diagram'}
                </Button>
                <Button variant="contained" className={classes.newButton} onClick={(e) => createTwoWayTable()} >
                    {newTestLoading.twoWayTable ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New 2 Way Table'}
                </Button>
                <Button variant="contained" className={classes.newButton} onClick={(e) => createSimulation()} >
                {newTestLoading.simulation ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New Simulation'}
                </Button>
                <Button variant="contained" className={classes.newButton}>
                    New Binomial Probability
                </Button>
                <Button variant="contained" className={classes.newButton}>
                    New Geometric Probability
                </Button>
            </Grid>

            <Grid container justify="center" style={{marginBottom: '1.5rem'}}>
                <Button variant="contained" className={classes.newButton} onClick={(e) => setSync(true)} >
                    {sync ? <Grid container alignItems="center" ><CircularProgress classes={{svg: classes.spinner}} size={20} /> Saving</Grid> : 'Save Changes'}
                </Button>
            </Grid>

            {/* <Box mb={4}>
                <Paper elevation={3} style={{paddingTop: '1rem'}} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                    <Simulation component={null} syncData={null} sync={null} index={null} data={formattedData} />
                </Paper>
            </Box>  */}

            {loading ? <div style={{marginBottom: '1.5rem'}}>
                <Grid container direction="row" alignItems="center" spacing={3}>
                    <Grid item>
                        <CircularProgress classes={{svg: classes.spinner}} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" style={{color: '#fff'}}>Loading...</Typography>
                    </Grid>
                </Grid>
            </div> : <Box>
                {tests.map((test, index) => {

                    if(test.type === 'treeDiagram') {
                        return (
                            <Paper key={index} elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper} ${classes.scrollX}`}>
                                <IconButton disableRipple aria-label="remove test" className={classes.deleteTestButton}
                                onClick={(e) => deleteTest(index, test._id)} >
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <TreeDiagram data={test} syncData={syncData} sync={sync} index={index} />
                            </Paper>
                        )
                    } if(test.type === 'twoWayTable') {
                        return (
                            <Paper key={index} elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                <IconButton disableRipple aria-label="remove test" className={classes.deleteTestButton}
                                onClick={(e) => deleteTest(index, test._id)}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <TwoWayTable component={test} syncData={syncData} sync={sync} index={index} />
                            </Paper>
                        )
                    } if(test.type === 'simulation') {
                        return (
                            <Paper key={index} elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                <IconButton disableRipple aria-label="remove test" className={classes.deleteTestButton}
                                onClick={(e) => deleteTest(index, test._id)}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <Simulation component={test} syncData={syncData} sync={sync} index={index} data={formattedData} />
                            </Paper>
                        )
                    }
                })}
            </Box>}

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