import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton,
     FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import twoSampleProp from '../../../utilities/twoSampleProp'
import twoSampleMean from '../../../utilities/twoSampleMean'
import NormalCurveCI from './NormalCurveCI'

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

interface SampleI {
    component:any;
    syncData:any;
    sync:boolean;
    index:number;
    data:string[][];
}

const fakeProperties = {
    type: 'proportion',
    inputMethod: 'manual', // other option is dataset
    inputs: {
        proportion1: '0',
        proportion2: '0',
        mean: '0',
        sampleSize1: '0',
        sampleSize2: '0',
        sampleSD: '0',
        datasetNum: 0,
        confidence: 0.95
    },
    displayGraph: false
}

export default function TwoSampleCI({component, syncData, sync, index, data}:SampleI) {

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
                    //properties: intervalProperties
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

    const [intervalProperties, setIntervalProperties] = useState(fakeProperties) // change to component.properties

    const intervalInfo:any = useMemo(() => {
        return intervalProperties.type === 'proportion' ? twoSampleProp(intervalProperties, data) : twoSampleMean(intervalProperties, data)
    }, [intervalProperties])

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
        <Box pl={3} pt={3}>
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
        </Box>
    )
}