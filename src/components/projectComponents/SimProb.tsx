import {useState, useEffect, useRef, useMemo} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Button, CircularProgress, Typography, Paper, IconButton} from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import TreeDiagram from './subComponents/TreeDiagram'

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

export default function SimProb({component, data}) {

    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [sync, setSync] = useState(false)
    const syncedRef = useRef([])
    const syncedCount = useRef(0)
    const [errorMsg, setErrorMsg] = useState(false)
    const [successMsg, setSuccessMsg] = useState(false)

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
                setErrorMsg(true)
            } else {
                setSuccessMsg(true)
            }
        }
    }


    const classes = useStyles()
    return (
        <div>
            <Grid container direction="row" spacing={3} justify="center" style={{marginBottom: '1rem'}}>
                <Button variant="contained" className={classes.newButton}>
                    New Tree Diagram
                </Button>
                <Button variant="contained" className={classes.newButton}>
                    New 2 Way Table
                </Button>
                <Button variant="contained" className={classes.newButton}>
                    New Simulation
                </Button>
                <Button variant="contained" className={classes.newButton}>
                    New Binomial Probability
                </Button>
                <Button variant="contained" className={classes.newButton}>
                    New Geometric Probability
                </Button>
            </Grid>

            <Grid container justify="center" style={{marginBottom: '1.5rem'}}>
                <Button variant="contained" className={classes.newButton} >
                    {sync ? <Grid container alignItems="center" ><CircularProgress classes={{svg: classes.spinner}} size={20} /> Saving</Grid> : 'Save Changes'}
                </Button>
            </Grid>

            <Paper elevation={3} className={classes.paper} >
                <TreeDiagram data={null} syncData={syncData} sync={sync} index={null} />
            </Paper>

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
                {tests.map((test, index) => {

                    if(test.type === 'treeDiagram') {
                        return (
                            <Paper key={index} elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                <IconButton disableRipple aria-label="remove test" className={classes.deleteGraphButton}
                                onClick={(e) => deleteTest(index, test._id)} >
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <TreeDiagram data={test} syncData={syncData} sync={sync} index={index} />
                            </Paper>
                        )
                    }
                })}
            </Grid>}
        </div>
    )
}