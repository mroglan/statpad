import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton,
     FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import oneSampleProp from '../../../utilities/oneSampleProp'
import oneSampleMean from '../../../utilities/oneSampleMean'
import NormalCurveCI from './NormalCurveCI'
import {IOneSampleCI, SyncData, Data} from '../projectInterfaces'

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
    numInput: {
        maxWidth: 120
    }
}))

interface Props {
    component: IOneSampleCI;
    syncData: SyncData;
    sync: boolean;
    index: number;
    data: Data;
}

const fakeProperties = {
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

export default function OneSampleCI({component, syncData, sync, index, data}:Props) {

    useEffect(() => {
        if(!sync) return
        //console.log('syncing data ' + index)
        const uploadData = async () => {
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/updateinterval`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: component._id,
                    properties: intervalProperties
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

    const [intervalProperties, setIntervalProperties] = useState(component.properties) // change to component.properties

    const intervalInfo:any = useMemo(() => {
        return intervalProperties.type === 'proportion' ? oneSampleProp(intervalProperties, data) : oneSampleMean(intervalProperties, data)
    }, [intervalProperties])

    console.log(intervalInfo)

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

    const classes = useStyles()
    return (
        <Box pl={6} pt={3}>
            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="type-label" className={classes.selectLabel}>Type</InputLabel>
                        <Select labelId="type-label" id="type" disableUnderline={true} 
                        value={intervalProperties.type} onChange={(e) => setIntervalProperties({...intervalProperties, type: e.target.value.toString(), inputMethod: 'manual'})}
                            label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            <MenuItem value="proportion">Proportion</MenuItem>
                            <MenuItem value="mean">Mean</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {intervalProperties.type === 'mean' && <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="inputMethod-label" className={classes.selectLabel}>Input Method</InputLabel>
                        <Select labelId="inputMethod-label" id="inputMethod" disableUnderline={true} 
                        value={intervalProperties.inputMethod} onChange={(e) => setIntervalProperties({...intervalProperties, inputMethod: e.target.value.toString()})}
                            label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            <MenuItem value="dataset">Dataset</MenuItem>
                            <MenuItem value="manual">Sample Stats</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>}
                {intervalProperties.inputMethod === 'manual' ? <>
                    {intervalProperties.type === 'mean' ? <Grid item>
                        <TextField label="Sample Mean" value={intervalProperties.inputs.mean} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setIntervalProperties({...intervalProperties, inputs: {
                            ...intervalProperties.inputs,
                            mean: e.target.value.toString()
                        }})} />
                    </Grid> : <Grid item>
                        <TextField label="Sample Prop." value={intervalProperties.inputs.proportion} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setIntervalProperties({...intervalProperties, inputs: {
                            ...intervalProperties.inputs,
                            proportion: e.target.value.toString()
                        }})} />
                    </Grid>}
                    <Grid item>
                        <TextField label="Sample Size" value={intervalProperties.inputs.sampleSize} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setIntervalProperties({...intervalProperties, inputs: {
                            ...intervalProperties.inputs,
                            sampleSize: e.target.value.toString()
                        }})} />
                    </Grid>
                    {intervalProperties.type === 'mean' && <Grid item>
                        <TextField label="Sample SD" value={intervalProperties.inputs.sampleSD} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setIntervalProperties({...intervalProperties, inputs: {
                            ...intervalProperties.inputs,
                            sampleSD: e.target.value.toString()
                        }})} />
                    </Grid>}
                </> : <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="num-label" className={classes.selectLabel}>List</InputLabel>
                        <Select labelId="num-label" id="num" disableUnderline={true} 
                        value={intervalProperties.inputs.datasetNum} onChange={(e) => setIntervalProperties({...intervalProperties, inputs: {
                            ...intervalProperties.inputs,
                            datasetNum: Number(e.target.value)
                        }})}
                        label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            {data[0].map((cell:string, cellNum:number) => (
                                <MenuItem key={cellNum} value={cellNum}>{cell}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>}
                <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="type-label" className={classes.selectLabel}>Confidence</InputLabel>
                        <Select labelId="type-label" id="type" disableUnderline={true} 
                        value={intervalProperties.inputs.confidence} onChange={(e) => setIntervalProperties({...intervalProperties, inputs: {
                            ...intervalProperties.inputs,
                            confidence: Number(e.target.value)
                        }})}
                            label="Confidence" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            <MenuItem value={.8}>80%</MenuItem>
                            <MenuItem value={.9}>90%</MenuItem>
                            <MenuItem value={.95}>95%</MenuItem>
                            <MenuItem value={.99}>99%</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControlLabel control={<GraphSwitch 
                    onChange={(e) => setIntervalProperties({...intervalProperties, displayGraph: !intervalProperties.displayGraph})} 
                    checked={intervalProperties.displayGraph} name="Display Graph" />} 
                    label="Display Graph" labelPlacement="start" classes={{label: classes.textWhite}} />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            {intervalProperties.type === 'proportion' ? 'Sample Proportion:' : 'Sample Mean:'} 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {intervalProperties.type === 'proportion' ? intervalInfo.prop : intervalInfo.mean}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Standard Error: 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {intervalInfo.SE.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Interval:
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {intervalProperties.type === 'proportion' ? intervalInfo.prop : intervalInfo.mean} &#xB1; {intervalInfo.interval.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box>
                {intervalProperties.displayGraph && <NormalCurveCI mean={intervalProperties.type === 'proportion' ? Number(intervalInfo.prop) : Number(intervalInfo.mean)}
                SD={intervalInfo.SE} range={intervalInfo.interval} 
                confidence={intervalProperties.inputs.confidence} name={intervalProperties.type === 'proportion' ? 'Proportion' : 'Mean'} />}
            </Box>
        </Box>
    )
}