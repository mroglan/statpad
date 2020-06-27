import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton,
     FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import regressionHT from '../../../utilities/regressionHT'

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
    component:any;
    syncData:any;
    sync:boolean;
    index:number;
    data:string[][];
}

const fakeProperties = {
    xNum: 0,
    yNum: 0,
    comparison: 'less'
}

export default function RegressionHT({component, syncData, sync, index, data}:TestI) {

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
    const [testInfo, setTestInfo] = useState({prob: 0, tScore: 0, a: 0, b: 0})

    const calculateHT = () => {
        setTestInfo(regressionHT(testProperties, data))
    }

    const classes = useStyles()
    return (
        <Box pl={6} pt={3}>
            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="x-label" className={classes.selectLabel}>X List</InputLabel>
                        <Select labelId="x-label" id="x" disableUnderline={true} 
                        value={testProperties.xNum} onChange={(e) => setTestProperties({...testProperties, xNum: Number(e.target.value)})}
                        label="X List" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            {data[0].map((cell:string, cellNum:number) => (
                                <MenuItem key={cellNum} value={cellNum}>{cell}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="y-label" className={classes.selectLabel}>Y List</InputLabel>
                        <Select labelId="y-label" id="y" disableUnderline={true} 
                        value={testProperties.yNum} onChange={(e) => setTestProperties({...testProperties, yNum: Number(e.target.value)})}
                        label="Y List" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            {data[0].map((cell:string, cellNum:number) => (
                                <MenuItem key={cellNum} value={cellNum}>{cell}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item style={{display: 'flex', alignItems: 'center'}} >
                    <Grid item style={{padding: '0 .5rem'}}>
                        <Typography variant="h6" className={classes.textWhite}>
                            &#946;
                        </Typography>
                    </Grid>
                    <Grid item style={{padding: '0 .5rem'}}>
                        <FormControl variant="filled" className={classes.formControlxs} hiddenLabel margin="dense">
                            <Select disableUnderline={true} style={{fontSize: '1.5em'}}
                            value={testProperties.comparison} onChange={(e) => setTestProperties({...testProperties, comparison: e.target.value.toString()})} 
                            aria-label="Comparison"
                            classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                <MenuItem value="less">&lt;</MenuItem>
                                <MenuItem value="notEqual">&#8800;</MenuItem>
                                <MenuItem value="greater">&gt;</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item style={{padding: '0 .5rem'}}>
                        <Typography variant="h6" className={classes.textWhite}>
                            0
                        </Typography>
                    </Grid>
                </Grid>
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
                            Regression:
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            y = {testInfo.a.toFixed(4)}x + {testInfo.b.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            T-Score: 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {testInfo.tScore.toFixed(4)}
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
