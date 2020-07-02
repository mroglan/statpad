import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton,
     FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import regressionCI from '../../../utilities/regressionCI'
import RegressionGraph from './RegressionGraph'
import {IRegressionCI, Data, SyncData} from '../projectInterfaces'

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

interface RegressionI {
    component: IRegressionCI;
    syncData: SyncData;
    sync: boolean;
    index: number;
    data: Data;
}

const fakeProperties = {
    xNum: 0,
    yNum: 0,
    confidence: .95,
    displayGraph: false
}

export default function RegressionCI({component, syncData, sync, index, data}:RegressionI) {

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
                    properties: regressionProperties
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

    const [regressionProperties, setRegressionProperties] = useState(component.properties) // change to component.properties

    const regressionInfo:any = useMemo(() => {
        return regressionCI(regressionProperties, data)
    }, [regressionProperties])

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
                        <InputLabel id="x-label" className={classes.selectLabel}>X List</InputLabel>
                        <Select labelId="x-label" id="x" disableUnderline={true} 
                        value={regressionProperties.xNum} onChange={(e) => setRegressionProperties({...regressionProperties, xNum: Number(e.target.value)})}
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
                        value={regressionProperties.yNum} onChange={(e) => setRegressionProperties({...regressionProperties, yNum: Number(e.target.value)})}
                        label="Y List" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            {data[0].map((cell:string, cellNum:number) => (
                                <MenuItem key={cellNum} value={cellNum}>{cell}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="type-label" className={classes.selectLabel}>Confidence</InputLabel>
                        <Select labelId="type-label" id="type" disableUnderline={true} 
                        value={regressionProperties.confidence} onChange={(e) => setRegressionProperties({...regressionProperties, confidence: Number(e.target.value)})}
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
                    onChange={(e) => setRegressionProperties({...regressionProperties, displayGraph: !regressionProperties.displayGraph})} 
                    checked={regressionProperties.displayGraph} name="Display Graph" />} 
                    label="Display Graph" labelPlacement="start" classes={{label: classes.textWhite}} />
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Regression:
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            y = {regressionInfo.a.toFixed(4)}x + {regressionInfo.b.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Standard Error:
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {regressionInfo.SE.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Interval:
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {regressionInfo.a.toFixed(4)} &#xB1; {regressionInfo.interval.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box>
                {regressionProperties.displayGraph && <RegressionGraph xNum={regressionProperties.xNum}
                yNum={regressionProperties.yNum} info={regressionInfo} data={data} /> }
            </Box>
        </Box>
    )
}

