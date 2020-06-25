import {useState, useEffect, useRef, useMemo} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Button, CircularProgress, Typography, Paper, IconButton, Snackbar, Box} from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import OneSampleCI from './CISubs/OneSampleCI'
import TwoSampleCI from './CISubs/TwoSampleCI'
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
        //marginBottom: '1rem'
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

const defaultOneSampleCIProperties = {
    type: 'proportion',
    inputMethod: 'manual', // other option is dataset
    inputs: {
        proportion: '0',
        mean: '0',
        sampleSize: '0',
        sampleSD: '0',
        datasetNum: 0,
        confidence: 0.95
    },
    displayGraph: false
}

export default function ConfidenceIntervals({component, data}) {
    
    const [intervals, setIntervals] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [sync, setSync] = useState(false)
    const syncedRef = useRef([])
    const syncedCount = useRef(0)
    const [errorMsg, setErrorMsg] = useState(false)
    const [successMsg, setSuccessMsg] = useState(false)
    const [newIntervalLoading, setNewIntervalLoading] = useState({
        sample1: false,
        sample2: false,
        regression: false
    })

    useEffect(() => {
        const getComponents = async () => {
            setLoading(true)
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/getintervals`, {
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
                setIntervals(json)
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
        if(syncedCount.current === intervals.length) {
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

    const deleteInterval = async (index:number, id:string) => {
        const intervalsCopy = [...intervals]
        intervalsCopy.splice(index, 1)
        syncedRef.current.splice(index, 1)
        setIntervals(intervalsCopy)
        await fetch(`${process.env.API_ROUTE}/projects/components/deleteinterval`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        })
    }

    const addToDatabase = async (newInterval, type:string) => {
        if(type === '1sampleCI') setNewIntervalLoading({...newIntervalLoading, sample1: true})

        const res = await fetch(`${process.env.API_ROUTE}/projects/components/newinterval`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newInterval)
        })
        const json = await res.json()

        if(type === '1sampleCI') setNewIntervalLoading({...newIntervalLoading, sample1: false})

        if(res.status !== 200) {
            setServerError(true)
            return
        }
        syncedRef.current.push(false)
        setIntervals([...intervals, json])
    }

    const create1SampleCI = async () => {
        const newSample = {
            component: component._id,
            type: '1sampleCI',
            properties: defaultOneSampleCIProperties
        }

        await addToDatabase(newSample, '1sampleCI')
    }

    const classes = useStyles()
    return (
        <div>
            <Grid container direction="row" spacing={3} justify="center" style={{marginBottom: '1rem'}}>
                <Button variant="contained" className={classes.newButton} onClick={(e) => create1SampleCI()} >
                    {newIntervalLoading.sample1 ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New 1 Sample CI'}
                </Button>
                <Button variant="contained" className={classes.newButton}>
                    {newIntervalLoading.sample2 ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New 2 Sample CI'}
                </Button>
                <Button variant="contained" className={classes.newButton}>
                    {newIntervalLoading.regression ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New Regression CI'}
                </Button>
            </Grid>

            <Grid container justify="center" style={{marginBottom: '1.5rem'}}>
                <Button variant="contained" className={classes.newButton} onClick={(e) => setSync(true)} >
                    {sync ? <Grid container alignItems="center" ><CircularProgress classes={{svg: classes.spinner}} size={20} /> Saving</Grid> : 'Save Changes'}
                </Button>
            </Grid>

            <Box py={'.5rem'} style={{overflow: 'hidden'}}>
                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                    <TwoSampleCI component={null} syncData={null} sync={null} index={null} data={formattedData} />
                </Paper>
            </Box> 

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
                {intervals.map((interval, index:number) => {
                    if(interval.type === '1sampleCI') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <IconButton disableRipple aria-label="remove test" className={classes.deleteTestButton}
                                    onClick={(e) => deleteInterval(index, interval._id)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <OneSampleCI component={interval} syncData={syncData} sync={sync} index={index} data={formattedData} />
                                </Paper>
                            </Box>
                        )
                    } if(interval.type === '2sampleCI') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <IconButton disableRipple aria-label="remove test" className={classes.deleteTestButton}
                                    onClick={(e) => deleteInterval(index, interval._id)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <TwoSampleCI component={interval} syncData={syncData} sync={sync} index={index} data={formattedData} />
                                </Paper>
                            </Box>
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