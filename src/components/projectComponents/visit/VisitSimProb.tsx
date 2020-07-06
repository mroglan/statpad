import {useState, useEffect, useRef, useMemo} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Button, CircularProgress, Typography, Paper, IconButton, Snackbar, Box} from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import TreeDiagram from '../simProbSubs/TreeDiagram'
import CloseIcon from '@material-ui/icons/Close'
import TwoWayTable from '../simProbSubs/TwoWayTable'
import Simulation from '../simProbSubs/Simulation'
import BinomialProb from '../simProbSubs/BinomialProb'
import GeoProb from '../simProbSubs/GeometricProb'
import {BaseSimProbTest, InputData, Data, SimProbComp} from '../projectInterfaces'

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

const defaultBinomialProperties = {
    type: 'single',
    trials: '0',
    probability: '0.0',
    successes: '0',
    displayGraph: false
}

const defaultGeometricProperties = {
    type: 'single',
    probability: '0.0',
    successNum: '0',
    displayGraph: false
}

interface Props {
    component: SimProbComp;
    data: InputData;
}

export default function SimProb({component, data}:Props) {

    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const sync = false
    const syncedRef = useRef([])

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

    const syncData = (index, success) => console.log('nothing')

    const classes = useStyles()
    return (
        <div>

            {/* <Box pb={'.5rem'}>
                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                    <GeoProb component={null} syncData={null} sync={null} index={null} />
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
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper} ${classes.scrollX}`}>
                                    <TreeDiagram data={test} syncData={syncData} sync={sync} index={index} />
                                </Paper>
                            </Box>
                        )
                    } if(test.type === 'twoWayTable') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <TwoWayTable component={test} syncData={syncData} sync={sync} index={index} />
                                </Paper>
                            </Box>
                        )
                    } if(test.type === 'simulation') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <Simulation component={test} syncData={syncData} sync={sync} index={index} data={formattedData} />
                                </Paper>
                            </Box>
                        )
                    } if(test.type === 'binomial') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <BinomialProb component={test} syncData={syncData} sync={sync} index={index} />
                                </Paper>
                            </Box>
                        )
                    } if(test.type === 'geometric') {
                        return (
                            <Box key={index} py={'.5rem'} style={{overflow: 'hidden'}}>
                                <Paper elevation={3} className={`${!sync ? classes.loadIn : ''} ${classes.paper}`}>
                                    <GeoProb component={test} syncData={syncData} sync={sync} index={index} />
                                </Paper>
                            </Box>
                        )
                    }
                })}
            </Box>}
        </div>
    )
}