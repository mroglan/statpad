import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton,
     FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import SimGraph from  './SimGraph'


const useStyles = makeStyles(theme => ({
    textWhite: {
        color: '#fff'
    },
    lightWhite: {
        color: 'rgba(255, 255, 255, .8)'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .5)'
    },
    textSuccess: {
        color: theme.palette.success.main
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
    },
    formControl: {
        minWidth: 120,
        '& > div': {
            border: '1px solid hsl(241, 82%, 90%)',
            borderRadius: '1rem'
        }
    },
    selectLabel: {
        color: 'hsl(241, 52%, 80%)'
    },
    rangeVal: {
        maxWidth: 120
    },
    borderLeft: {
        borderLeft: '1px solid rgba(255, 255, 255, .5)'
    },
    borderRight: {
        borderRight: '1px solid rgba(255, 255, 255, .5)'
    },
    simulateButton: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)'
        },
    },
    table: {
        border: 'none',
        '& td': {
            borderCollapse: 'collapse',
            backgroundClip: 'padding-box',
            mozBackgroundClip: 'padding-box',
            webkitBackgroundClip: 'padding-box'
        }
    },
    cell: {
        border: '1px solid #fff',
        padding: '.6rem 3rem'
    }
}))

interface SimulationI {
    component:any;
    syncData:any;
    sync:boolean;
    index:number;
    data:string[][];
}

const fakeData:any = {
    output: []
}

const fakeProperties:any = {
    trials: '0',
    inputType: 'range',
    range: {
        min: '0',
        max: '0'
    },
    datasetNum: 0,
    displayGraph: false
}

export default function Simulation({component, syncData, sync, index, data}:SimulationI) {

    useEffect(() => {
        if(!sync) return
        //console.log('syncing data ' + index)
        const uploadData = async () => {
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/updatetest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: component._id,
                    data: simData,
                    properties: simProperties
                })
            })
            if(res.status !== 200) {
                syncData(index, false)
                return
            }
            syncData(index, true)
        }
        uploadData()
    }, [sync])

    const tableCellItemCount = useRef<number>(0)
    tableCellItemCount.current = 0

    const [simData, setSimData] = useState(component.data) // change to component.data
    const [simProperties, setSimProperties] = useState(component.properties) // change to component.properties

    // useMemo(() => {
        
    // }, [simProperties])

    const createRangeOutput = (min:number, max:number, trials:number) => {
        return Array(trials).fill(null).map(() => Math.round(Math.random() * (max - min)) + min)
    }

    const createDatasetOutput = (colNum:number, trials:number) => {
        const possibleValues = data.map((row:string[], rowNum:number) => {
            if(rowNum === 0 || !row[colNum]) return
            return row[colNum]
        }).filter(el => el)
        const range = possibleValues.length - 1
        return Array(trials).fill(null).map(() => possibleValues[Math.round(Math.random() * range)])
    }

    const simulate = () => {
        if(simProperties.inputType === 'range') {
            const output = createRangeOutput(Number(simProperties.range.min), Number(simProperties.range.max), Number(simProperties.trials))
            setSimData({...simData, output})
        } else {
            const output = createDatasetOutput(simProperties.datasetNum, Number(simProperties.trials))
            setSimData({...simData, output})
        }
    }

    const classes = useStyles()

    const GraphSwitch = withStyles((theme) => ({
        root: {
            width: 42,
            height: 26,
            padding: 0,
            margin: theme.spacing(1),
          },
          switchBase: {
            padding: 1,
            '&$checked': {
              transform: 'translateX(16px)',
              color: theme.palette.common.white,
              '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none',
              },
            },
            '&$thumb': {
              color: '#52d869',
              border: '6px solid #fff',
            },
          },
          thumb: {
            width: 24,
            height: 24,
          },
          track: {
            borderRadius: 26 / 2,
            border: `1px solid ${theme.palette.grey[400]}`,
            backgroundColor: theme.palette.grey[400],
            opacity: 1,
            transition: theme.transitions.create(['background-color', 'border']),
          },
          checked: {},
    }))(Switch)

    const minWidth = Number(simProperties.trials) * 50
    
    return (
        <Box pt={4}>
            <Box px={6}>
                <Grid container direction="row" spacing={3}>
                    <Grid item>
                        <FormControl variant="filled" className={classes.formControl}>
                            <InputLabel id="plot-type-label" className={classes.selectLabel}>Data Type</InputLabel>
                            <Select labelId="plot-type-label" id="plot-type" disableUnderline={true} 
                            value={simProperties.inputType} onChange={(e) => setSimProperties({...simProperties, inputType: e.target.value.toString()})}
                             label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                <MenuItem value="range">Range</MenuItem>
                                <MenuItem value="dataset">List</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        {simProperties.inputType === 'range' ? <>
                        <Grid container spacing={3} justify="center" alignItems="center">
                            <Grid item>
                                <TextField label="Min" value={simProperties.range.min} className={classes.rangeVal}
                                variant="outlined" InputProps={{className: classes.textWhite}}
                                InputLabelProps={{className: classes.dimWhite}} 
                                onChange={(e) => setSimProperties({...simProperties, range: {
                                    min: e.target.value.toString(),
                                    max: simProperties.range.max
                                }})} />
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" className={classes.textWhite}>
                                    to
                                </Typography>
                            </Grid>
                            <Grid item>
                                <TextField label="Max" value={simProperties.range.max} className={classes.rangeVal}
                                variant="outlined" InputProps={{className: classes.textWhite}}
                                InputLabelProps={{className: classes.dimWhite}} 
                                onChange={(e) => setSimProperties({...simProperties, range: {
                                    max: e.target.value.toString(),
                                    min: simProperties.range.min
                                }})} />
                            </Grid>
                        </Grid>
                        </> : <>
                            <FormControl variant="filled" className={classes.formControl}>
                                <InputLabel id="plot-type-label" className={classes.selectLabel}>List</InputLabel>
                                <Select labelId="plot-type-label" id="plot-type" disableUnderline={true} 
                                value={simProperties.datasetNum} onChange={(e) => setSimProperties({...simProperties, datasetNum: e.target.value})}
                                label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                    {data[0].map((cell:string, cellNum:number) => (
                                        <MenuItem key={cellNum} value={cellNum}>{cell}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>}
                    </Grid>
                </Grid>
                <Grid container spacing={3} style={{marginTop: '1rem'}} alignItems="center" >
                    <Grid item>
                        <TextField label="Trials" value={simProperties.trials} className={classes.rangeVal}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}} 
                        onChange={(e) => setSimProperties({...simProperties, trials: e.target.value})} />
                    </Grid>
                    <Grid item>
                        <FormControlLabel control={<GraphSwitch 
                        onChange={(e) => setSimProperties({...simProperties, displayGraph: !simProperties.displayGraph})} 
                        checked={simProperties.displayGraph} name="Display Graph" />} 
                        label="Display Graph" labelPlacement="start" classes={{label: classes.textWhite}} />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" className={classes.simulateButton} onClick={(e) => simulate()} >
                            Simulate
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box pt={3} pl={3} className={classes.scrollX}>
                <Grid container style={{minWidth: minWidth}}>
                    <Paper elevation={0} style={{backgroundColor: 'hsl(241, 82%, 47%)'}}>
                        <TableContainer>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.cell}>
                                            <Typography variant="h6" style={{textAlign: 'center'}} className={classes.lightWhite}>
                                                Trial
                                            </Typography>
                                        </TableCell>
                                        {Array(Number(simProperties.trials)).fill(null).map((_, trialNum:number) => (
                                            <TableCell key={trialNum} className={classes.cell}>
                                                <Typography variant="h6" style={{textAlign: 'center'}} className={classes.lightWhite}>
                                                    {trialNum + 1}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className={classes.cell}>
                                            <Typography variant="h6" style={{textAlign: 'center'}} className={classes.textWhite}>
                                                Outcome
                                            </Typography>
                                        </TableCell>
                                        {simData.output.map((result:string, resIndex:number) => (
                                            <TableCell key={resIndex} className={classes.cell}>
                                                <Typography variant="h6" style={{textAlign: 'center'}} className={classes.textWhite}>
                                                    {result}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Box>
            <Box>
                {simProperties.displayGraph && <Box>
                    <SimGraph output={simData.output} lists={data} properties={simProperties} />
                </Box>}
            </Box>
        </Box>
    )
}
