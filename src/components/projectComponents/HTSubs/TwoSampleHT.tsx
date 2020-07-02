import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton,
     FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import twoSamplePropHT from '../../../utilities/twoSamplePropHT'
import twoSampleMeanHT from '../../../utilities/twoSampleMeanHT'
import {ITwoSampleHT, SyncData, Data} from '../projectInterfaces'

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
    component: ITwoSampleHT;
    syncData: SyncData;
    sync: boolean;
    index: number;
    data: Data;
}

const fakeProperties = {
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

export default function TwoSampleHT({component, syncData, sync, index, data}:TestI) {

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
    const [testInfo, setTestInfo] = useState({prob: 0, zScore: 0, testStat1: 0, testStat2: 0})

    const calculateHT = () => {
        setTestInfo(testProperties.type === 'proportion' ? twoSamplePropHT(testProperties, data) : twoSampleMeanHT(testProperties, data))
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
                <Grid item style={{display: 'flex', alignItems: 'center'}}>
                    <Grid item style={{padding: '0 .5rem'}}>
                        <Typography variant="h6" className={classes.textWhite}>
                            &#956;<sub>1</sub>
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
                            &#956;<sub>2</sub>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button variant="contained" className={classes.calcButton} onClick={(e) => calculateHT()} >
                        Calculate
                    </Button>
                </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={3} style={{marginTop: '1rem'}}>
                <Grid item sm={3}>
                    <Box textAlign="center">
                        <Typography variant="h6" className={classes.textWhite}>
                            Sample 1
                        </Typography>
                    </Box>
                </Grid>
                {testProperties.type === 'proportion' ? <>
                    <Grid item>
                        <TextField label="Sample Prop." value={testProperties.inputs.proportion1} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            proportion1: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample Size" value={testProperties.inputs.sampleSize1} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSize1: e.target.value.toString()
                        }})} />
                    </Grid>
                </> : testProperties.inputMethod === 'manual' ? <>
                    <Grid item>
                        <TextField label="Sample Mean" value={testProperties.inputs.mean1} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            mean1: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample Size" value={testProperties.inputs.sampleSize1} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSize1: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample SD" value={testProperties.inputs.sampleSD1} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSD1: e.target.value.toString()
                        }})} />
                    </Grid>
                </> : <>
                    <Grid item>
                        <FormControl variant="filled" className={classes.formControl}>
                            <InputLabel id="num-label" className={classes.selectLabel}>List</InputLabel>
                            <Select labelId="num-label" id="num" disableUnderline={true} 
                            value={testProperties.inputs.datasetNum1} onChange={(e) => setTestProperties({...testProperties, inputs: {
                                ...testProperties.inputs,
                                datasetNum1: Number(e.target.value)
                            }})}
                            label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                {data[0].map((cell:string, cellNum:number) => (
                                    <MenuItem key={cellNum} value={cellNum}>{cell}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </>}
            </Grid>
            <Grid container spacing={3} alignItems="center" style={{marginTop: '1rem'}}>
                <Grid item sm={3}>
                    <Box textAlign="center">
                        <Typography variant="h6" className={classes.textWhite}>
                            Sample 2
                        </Typography>
                    </Box>
                </Grid>
                {testProperties.type === 'proportion' ? <>
                    <Grid item>
                        <TextField label="Sample Prop." value={testProperties.inputs.proportion2} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            proportion2: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample Size" value={testProperties.inputs.sampleSize2} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSize2: e.target.value.toString()
                        }})} />
                    </Grid>
                </> : testProperties.inputMethod === 'manual' ? <>
                    <Grid item>
                        <TextField label="Sample Mean" value={testProperties.inputs.mean2} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            mean2: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample Size" value={testProperties.inputs.sampleSize2} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSize2: e.target.value.toString()
                        }})} />
                    </Grid>
                    <Grid item>
                        <TextField label="Sample SD" value={testProperties.inputs.sampleSD2} className={classes.numInput}
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}}
                        onChange={(e) => setTestProperties({...testProperties, inputs: {
                            ...testProperties.inputs,
                            sampleSD2: e.target.value.toString()
                        }})} />
                    </Grid>
                </> : <>
                    <Grid item>
                        <FormControl variant="filled" className={classes.formControl}>
                            <InputLabel id="num-label" className={classes.selectLabel}>List</InputLabel>
                            <Select labelId="num-label" id="num" disableUnderline={true} 
                            value={testProperties.inputs.datasetNum2} onChange={(e) => setTestProperties({...testProperties, inputs: {
                                ...testProperties.inputs,
                                datasetNum2: Number(e.target.value)
                            }})}
                            label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                {data[0].map((cell:string, cellNum:number) => (
                                    <MenuItem key={cellNum} value={cellNum}>{cell}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </>}
            </Grid>
            <Grid container spacing={3} style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            {testProperties.type === 'proportion' ? 'Sample 1 Proportion:' : 'Sample 1 Mean:'} 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {testInfo.testStat1}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            {testProperties.type === 'proportion' ? 'Sample 2 Proportion:' : 'Sample 2 Mean:'} 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {testInfo.testStat2}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{marginTop: '1rem'}}>
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