import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton,
     FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import factorial from '../../../utilities/factorial'
import binomialcdf from '../../../utilities/binomialcdf'
import BinomialGraph from './BinomialGraph'

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

interface BinomialI {
    component:any;
    syncData:any;
    sync:boolean;
    index:number;
}

const fakeProperties = {
    type: 'single',
    trials: '0',
    probability: '0.0',
    successes: '0',
    displayGraph: false
}

export default function BinomialProb({component, syncData, sync, index}:BinomialI) {

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
                    data: 0,
                    properties: binomialProperties
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

    const binomialInfo = useRef<any>()

    const [binomialProperties, setBinomialProperties] = useState(component.properties) // change to component.properties

    useMemo(() => {
        const {trials, successes, probability} = binomialProperties
        //if(Number(trials) < 0 || Number(successes) < 0 || Number(probability) < 0) return 
        const coef = factorial(Number(trials)) / (factorial(Number(successes)) * factorial(Number(trials) - Number(successes)) )
        const prob = coef * Math.pow(Number(probability), Number(successes)) * Math.pow(1 - Number(probability), Number(trials) - Number(successes))
        
        const probCoef = binomialProperties.type === 'single' ? {coef, prob} : binomialcdf(Number(trials), Number(successes), Number(probability))
        
        const mean = Number(trials) * Number(probability)
        const sd = Math.sqrt(Number(trials) * Number(probability) * (1 - Number(probability)))

        binomialInfo.current = {...probCoef, mean, sd}
    }, [binomialProperties])

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
                        <InputLabel id="plot-type-label" className={classes.selectLabel}>Probability Type</InputLabel>
                        <Select labelId="plot-type-label" id="plot-type" disableUnderline={true} 
                        value={binomialProperties.type} onChange={(e) => setBinomialProperties({...binomialProperties, type: e.target.value.toString()})}
                            label="Data Type" classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            <MenuItem value="single">Single</MenuItem>
                            <MenuItem value="cumulative">Cumulative</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <TextField label="Trials" value={binomialProperties.trials} className={classes.numInput}
                    variant="outlined" InputProps={{className: classes.textWhite}}
                    InputLabelProps={{className: classes.dimWhite}} 
                    onChange={(e) => setBinomialProperties({...binomialProperties, trials: e.target.value})} />
                </Grid>
                <Grid item>
                    <TextField label="Success Prob." value={binomialProperties.probability.substring(2)} className={classes.numInput}
                    variant="outlined" InputProps={{className: classes.textWhite, 
                    startAdornment: <InputAdornment disableTypography style={{color: '#fff'}} position="start">0.</InputAdornment>}}
                    InputLabelProps={{className: classes.dimWhite}}
                    onChange={(e) => setBinomialProperties({...binomialProperties, probability: '0.' + e.target.value})} />
                </Grid>
                <Grid item>
                    <TextField label="Successes" value={binomialProperties.successes} className={classes.numInput}
                    variant="outlined" InputProps={{className: classes.textWhite}}
                    InputLabelProps={{className: classes.dimWhite}}
                    onChange={(e) => setBinomialProperties({...binomialProperties, successes: e.target.value})} />
                </Grid>
                <Grid item>
                    <FormControlLabel control={<GraphSwitch 
                    onChange={(e) => setBinomialProperties({...binomialProperties, displayGraph: !binomialProperties.displayGraph})} 
                    checked={binomialProperties.displayGraph} name="Display Graph" />} 
                    label="Display Graph" labelPlacement="start" classes={{label: classes.textWhite}} />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Coefficient: 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {Number(binomialInfo.current.coef) ? binomialInfo.current.coef.toFixed() : binomialInfo.current.coef}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Probability:
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {binomialInfo.current.prob.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '1rem'}}>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Mean: 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {binomialInfo.current.mean.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box textAlign="center">
                        <Typography variant="h6" style={{display: 'inline'}} className={classes.lightWhite}>
                            Standard Deviation: 
                        </Typography>
                        <Typography variant="h6" style={{paddingLeft: '1rem', display: 'inline'}} className={classes.textWhite}>
                            {binomialInfo.current.sd.toFixed(4)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box>
                {binomialProperties.displayGraph && <BinomialGraph trials={Number(binomialProperties.trials)} 
                probability={Number(binomialProperties.probability)} />}
            </Box>
        </Box>
    )
}