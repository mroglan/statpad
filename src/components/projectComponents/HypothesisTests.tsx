import {useState, useEffect, useRef, useMemo} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Button, CircularProgress, Typography, Paper, IconButton, Snackbar, Box} from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import CloseIcon from '@material-ui/icons/Close'
import OneSampleHT from './HTSubs/OneSampleHT'
import TwoSampleHT from './HTSubs/TwoSampleHT'
import RegressionHT from './HTSubs/RegressionHT'
import {BaseHypothesisTest, InputData, Data, HypTestsComp} from './projectInterfaces'
import updateCompDate from '../../requests/updateCompDate'

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

const defaultOneSampleProperties = {
    type: 'proportion',
    inputMethod: 'manual', // other option is dataset
    inputs: {
        proportion: '0',
        mean: '0',
        sampleSize: '0',
        sampleSD: '0',
        datasetNum: 0,
        comparison: 'less', // 'greater' 'both'
        nullH: '0'
    }
}

const defaultTwoSampleProperties = {
    type: 'proportion',
    inputMethod: 'manual', // other option is dataset
    inputs: {
        proportion1: '0',
        proportion2: '0',
        mean1: '0',
        mean2: '0',
        sampleSize1: '0',
        sampleSize2: '0',
        sampleSD1: '0',
        sampleSD2: '0',
        datasetNum1: 0,
        datasetNum2: 0,
        comparison: 'less', // 'greater' 'both'
    }
}

const defaultRegressionProperties = {
    xNum: 0,
    yNum: 0,
    comparison: 'less'
}

interface Props {
    component: HypTestsComp;
    data: InputData;
    projectId: string;
}

export default function HypotheisTests({component, data, projectId}:Props) {

    const [tests, setTests] = useState<any>([])
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
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/gethtests`, {
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
        if(data2.length === 0) data2 = [[]]
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
            await updateCompDate(component._id)
        }
    }

    const deleteTest = async (index:number, id:string) => {
        const testsCopy = [...tests]
        testsCopy.splice(index, 1)
        syncedRef.current.splice(index, 1)
        setTests(testsCopy)
        await fetch(`${process.env.API_ROUTE}/projects/components/deletehtest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                testId: id,
                projectId
            })
        })
    }

    const addToDatabase = async (newTest:BaseHypothesisTest, type:string) => {
        if(type === '1sampleHT') setNewIntervalLoading({...newIntervalLoading, sample1: true})
        else if(type === '2sampleHT') setNewIntervalLoading({...newIntervalLoading, sample2: true})
        else if(type === 'regression') setNewIntervalLoading({...newIntervalLoading, regression: true})

        const res = await fetch(`${process.env.API_ROUTE}/projects/components/newhtest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                test: newTest,
                projectId
            })
        })
        const json = await res.json()

        if(type === '1sampleHT') setNewIntervalLoading({...newIntervalLoading, sample1: false})
        else if(type === '2sampleHT') setNewIntervalLoading({...newIntervalLoading, sample2: false})
        else if(type === 'regression') setNewIntervalLoading({...newIntervalLoading, regression: false})

        if(res.status !== 200) {
            setServerError(true)
            return
        }
        syncedRef.current.push(false)
        setTests([...tests, json])
    }

    const createOneSampleHT = async () => {
        const newSample = {
            component: component._id,
            type: '1sampleHT',
            properties: defaultOneSampleProperties
        }

        await addToDatabase(newSample, '1sampleHT')
    }

    const createTwoSampleHT = async () => {
        const newSample = {
            component: component._id,
            type: '2sampleHT',
            properties: defaultTwoSampleProperties
        }

        await addToDatabase(newSample, '2sampleHT')
    }

    const createRegressionHT = async () => {
        const newReg = {
            component: component._id,
            type: 'regression',
            properties: defaultRegressionProperties
        }

        await addToDatabase(newReg, 'regression')
    }

    const classes = useStyles()
    return (
        <div>
            <Grid container direction="row" spacing={3} justify="center" style={{marginBottom: '1rem'}}>
                <Button variant="contained" className={classes.newButton} onClick={(e) => createOneSampleHT()} >
                    {newIntervalLoading.sample1 ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New 1 Sample HT'}
                </Button>
                <Button variant="contained" className={classes.newButton} onClick={(e) => createTwoSampleHT()} >
                    {newIntervalLoading.sample2 ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New 2 Sample HT'}
                </Button>
                <Button variant="contained" className={classes.newButton} onClick={(e) => createRegressionHT()} >
                    {newIntervalLoading.regression ? <Grid container alignItems="center"><CircularProgress classes={{svg: classes.spinner}} size={20} /> Adding</Grid> : 'New Regression HT'}
                </Button>
            </Grid>

            <Grid container justify="center" style={{marginBottom: '1.5rem'}}>
                <Button variant="contained" className={classes.newButton} onClick={(e) => setSync(true)} >
                    {sync ? <Grid container alignItems="center" ><CircularProgress classes={{svg: classes.spinner}} size={20} /> Saving</Grid> : 'Save Changes'}
                </Button>
            </Grid>

            {/* <Box py={'.5rem'} style={{overflow: 'hidden'}}>
                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                    <RegressionHT component={null} syncData={null} sync={null} index={null} data={formattedData} />
                </Paper>
            </Box> */}

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
                {tests.map((test, index:number) => {
                    if(test.type === '1sampleHT') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <IconButton disableRipple aria-label="remove test" className={classes.deleteTestButton}
                                    onClick={(e) => deleteTest(index, test._id)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <OneSampleHT component={test} syncData={syncData} sync={sync} index={index} data={formattedData} />
                                </Paper>
                            </Box>
                        )
                    } if(test.type === '2sampleHT') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <IconButton disableRipple aria-label="remove test" className={classes.deleteTestButton}
                                    onClick={(e) => deleteTest(index, test._id)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <TwoSampleHT component={test} syncData={syncData} sync={sync} index={index} data={formattedData} />
                                </Paper>
                            </Box>
                        )
                    } if(test.type === 'regression') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <IconButton disableRipple aria-label="remove test" className={classes.deleteTestButton}
                                    onClick={(e) => deleteTest(index, test._id)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <RegressionHT component={test} syncData={syncData} sync={sync} index={index} data={formattedData} />
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