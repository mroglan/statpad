import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton,
     FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import oneSamplePropHT from '../../../utilities/oneSamplePropHT'
import oneSampleMeanHT from '../../../utilities/oneSampleMeanHT'
import {IOneSampleHT, SyncData, Data} from '../projectInterfaces'

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
    formControlxs: {
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
    },
    calcButton: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)'
        },
    },
}))

interface TestI {
    component: IOneSampleHT;
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
        comparison: 'less', // 'greater' 'both'
        nullH: '0'
    }
}

export default function OneSampleHT({component, syncData, sync, index, data}:TestI) {

    useEffect(() => {
        if(!sync) return
        //console.log('syncing data ' + index)
        const uploadData = async () => {
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/updatehtest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: component._id,
                    properties: testProperties
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

    const [testProperties, setTestProperties] = useState(component.properties) // change to component.properties
    const [testInfo, setTestInfo] = useState({prob: 0, zScore: 0, testStat: 0})

    // const testInfo = useMemo(() => {
    //     return testProperties.type === 'proportion' ? oneSamplePropHT(testProperties, data) : oneSampleMeanHT(testProperties, data)
    // }, [testProperties])

    const calculateHT = () => {
        console.log('starting calculation')
        setTestInfo(testProperties.type === 'proportion' ? oneSamplePropHT(testProperties, data) : oneSampleMeanHT(testProperties, data))
    }

    const classes = useStyles()
    return (
        <Box pl={6} pt={3}>
            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="type-label" className={classes.selectLabel}>Type</InputLabel>
                        <Select labelId="type-label" id="type" disableUnderline={true} 
                        value={testProperties.type} onChange={(e) => setTestProperties({...testProperties, type: e.target.value.toString(), inputMethod: 'manual'})}
                            label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            <MenuItem value="proportion">Proportion</MenuItem>
                            <MenuItem value="mean">Mean</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {testProperties.type === 'mean' && <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="inputMethod-label" className={classes.selectLabel}>Type</InputLabel>
                        <Select labelId="inputMethod-label" id="inputMethod" disableUnderline={true} 
                        value={testProperties.inputMethod} onChange={(e) => setTestProperties({...testProperties, inputMethod: e.target.value.toString()})}
                            label="Input  Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            <MenuItem value="dataset">Dataset</MenuItem>
                            <MenuItem value="manual">Sample Stats</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>}
                <Grid item>
                    <TextField label="Ho" value={testProperties.inputs.nullH} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            nullH: e.target.value.toString()
                        }})} />
                </Grid>
                {testProperties.type === 'proportion' ? <>
                    <Grid item>
                        <TextField label="Sample Prop." value={testProperties.inputs.proportion} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            proportion: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample Size" value={testProperties.inputs.sampleSize} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSize: e.target.value.toString()
                        }})} />
                    </Grid>
                </> : testProperties.inputMethod === 'manual' ? <>
                    <Grid item>
                        <TextField label="Sample Mean" value={testProperties.inputs.mean} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            mean: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample Size" value={testProperties.inputs.sampleSize} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSize: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample SD" value={testProperties.inputs.sampleSD} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSD: e.target.value.toString()
                        }})} />
                    </Grid>
                </> : <>
                    <Grid item>
                        <FormControl variant="filled" className={classes.formControl}>
                            <InputLabel id="num-label" className={classes.selectLabel}>List</InputLabel>
                            <Select labelId="num-label" id="num" disableUnderline={true} 
                            value={testProperties.inputs.datasetNum} onChange={(e) => setTestProperties({...testProperties, inputs: {
                                ...testProperties.inputs,
                                datasetNum: Number(e.target.value)
                            }})}
                            label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                {data[0].map((cell:string, cellNum:number) => (
                                    <MenuItem key={cellNum} value={cellNum}>{cell}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </>}
                <Grid item style={{display: 'flex', alignItems: 'center'}}>
                    <Grid item style={{padding: '0 .5rem'}}>
                        <Typography variant="h6" className={classes.textWhite}>
                            {testProperties.type === 'proportion' ? 'Prop' : 'Mean'}
                        </Typography>
                    </Grid>
                    <Grid item style={{padding: '0 .5rem'}}>
                        <FormControl variant="filled" className={classes.formControlxs} hiddenLabel margin="dense">
                            <Select disableUnderline={true} style={{fontSize: '1.5em'}}
                            value={testProperties.inputs.comparison} onChange={(e) => setTestProperties({...testProperties, inputs: {
                                ...testProperties.inputs,
                                comparison: e.target.value.toString()
                            }})} aria-label="Comparison"
                            classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                <MenuItem value="less">&lt;</MenuItem>
                                <MenuItem value="notEqual">&#8800;</MenuItem>
                                <MenuItem value="greater">&gt;</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item style={{padding: '0 .5rem'}}>
                        <Typography variant="h6" className={classes.textWhite}>
                            {testProperties.inputs.nullH}
                        </Typography>
                    </Grid>
                </Grid>
                {/* <Grid item>
                    <FormControlLabel control={<GraphSwitch 
                    onChange={(e) => setTestProperties({...testProperties, displayGraph: !testProperties.displayGraph})} 
                    checked={testProperties.displayGraph} name="Display Graph" />} 
                    label="Display Graph" labelPlacement="start" classes={{label: classes.textWhite}} />
                </Grid> */}
                <Grid item>
                    <Button variant="contained" className={classes.calcButton} onClick={(e) => calculateHT()} >
                        Calculate
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            {testProperties.type === 'proportion' ? 'Sample Proportion:' : 'Sample Mean:'} 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {testInfo.testStat}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            {testProperties.type === 'proportion' ? 'Z-Score:' : 'T-Score:'}
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {testInfo.zScore.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Probability:
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {testInfo.prob.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}