import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, TextField, Button, Slider} from '@material-ui/core'
import OptionsInterface from './optionsInterface'
import {useRef, useState, useMemo} from 'react'
import ShowChartIcon from '@material-ui/icons/ShowChart'
import GestureIcon from '@material-ui/icons/Gesture';

const useStyles = makeStyles(theme => ({
    dialog: {
        backgroundColor: 'hsl(241, 82%, 60%)',
        color: '#fff'
    },
    chartName: {
        color: '#fff',
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .5)'
    },
    colorInput: {
        '&:hover': {
            cursor: 'pointer'
        },
        minWidth: 20
    },
    newButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
        margin: theme.spacing(1)
    },
    morePadding: {
        padding: '1rem 0'
    },
    numberInput: {
        marginLeft: '1rem',
        paddingLeft: '.5rem',
        paddingRight: '.5rem',
        border: '1px solid black',
        borderRadius: '3px',
        maxWidth: '5rem',
        '& input': {
            color: '#fff'
        }
    },
    slider: {
        color: 'hsl(241, 82%, 50%)'
    }
}))

export default function regressionOptionsDialog({property, index, handlePropertyChange, handleOptionsClose, optionsSwitch}: OptionsInterface) {
 
    const updateChart = () => {
        const propertyCopy = {...property}
        propertyCopy.options.line = {
            color: lineColorRef.current.value,
            width: lineWidthRef.current.value,
            tension: lineTension
        }
        propertyCopy.label = nameRef.current.value
        console.log(propertyCopy)
        handlePropertyChange(propertyCopy, index - 1)
        handleOptionsClose()
    }

    const nameRef = useRef<HTMLInputElement>()
    const lineColorRef = useRef<HTMLInputElement>() 
    const lineWidthRef = useRef<HTMLInputElement>()

    const [lineTension, setLineTension] = useState(property.options.line.tension)

    useMemo(() => {
        setLineTension(property.options.line.tension)
    }, [property])

    const changeTension = (e:any, value:number) => {
        setLineTension(value)
    }
    
    //console.log(index)
    const classes = useStyles()
    return (
        <Dialog fullWidth open={optionsSwitch[index]} onClose={handleOptionsClose} aria-labelledby="scatter plot options"
        classes={{paper: classes.dialog}} >
            <DialogTitle style={{textAlign: 'center'}}>Regression Options</DialogTitle>
            <DialogContent>
                <Grid container direction="row" className={classes.morePadding}>
                    <Grid item xs={12}>
                        <TextField label="Chart name" variant="outlined" helperText="For the graph legend" InputProps={{className: classes.chartName}}
                        InputLabelProps={{className: classes.dimWhite}} FormHelperTextProps={{className: classes.dimWhite}}
                        inputRef={nameRef} defaultValue={property.label} />
                    </Grid>
                </Grid>
                <Grid container direction="row" className={classes.morePadding}>
                    <Grid item sm={4} container alignItems="center">
                        <label>Line Color </label>
                        <input type="color" aria-label="Line color" defaultValue={property.options.line.color}
                            className={classes.colorInput} ref={lineColorRef} />
                    </Grid>
                    <Grid item sm={4} container alignItems="center">
                        <label>Line Width</label>
                        <TextField type="text" defaultValue={property.options.line.width} inputRef={lineWidthRef}
                        className={classes.numberInput} InputProps={{ disableUnderline: true }}
                         />
                    </Grid>
                </Grid>
                <Grid container direction="row" className={classes.morePadding}>
                    <Grid item sm={6} container alignItems="center">
                        <Typography variant="h6" gutterBottom>
                            Line Tension
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item>
                                <ShowChartIcon style={{color: 'hsl(241, 82%, 90%)'}} />
                            </Grid>
                            <Grid item xs>
                                <Slider value={lineTension} aria-labelledby="line tension" step={.1}
                                min={0} max={1} marks={[{value: .4, label: '0.4'}]} valueLabelDisplay="auto"
                                classes={{colorPrimary: classes.slider}} onChange={(e, value:number) => changeTension(e, value)} /> 
                            </Grid>
                            <Grid item>
                                <GestureIcon style={{color: 'hsl(241, 82%, 90%)'}} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Box mx="auto">
                    <Button className={classes.newButton} onClick={(e) => updateChart()} >
                        Update
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}
