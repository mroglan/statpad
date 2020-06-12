import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, TextField, Button} from '@material-ui/core'
import OptionsInterface from './optionsInterface'
import {useRef} from 'react'

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
        minWidth: 20,
        marginLeft: '.5rem'
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
}))

export default function bubbleOptionsDialog({property, index, handlePropertyChange, handleOptionsClose, optionsSwitch}: OptionsInterface) {

    const updateChart = () => {
        const propertyCopy = {...property}
        propertyCopy.options.points.color = pointColorRef.current.value || 'none'
        propertyCopy.options.points.maxRadius = pointRadiusRef.current.value
        propertyCopy.label = nameRef.current.value
        handlePropertyChange(propertyCopy, index - 1)
        handleOptionsClose()
    }

    const nameRef = useRef<HTMLInputElement>()
    const pointColorRef = useRef<HTMLInputElement>()
    const pointRadiusRef = useRef<HTMLInputElement>()
    
    const classes = useStyles()
    return (
        <Dialog fullWidth open={optionsSwitch[index]} onClose={handleOptionsClose} aria-labelledby="scatter plot options"
        classes={{paper: classes.dialog}} >
            <DialogTitle style={{textAlign: 'center'}}>Chart Options</DialogTitle>
            <DialogContent>
                <Grid container direction="row">
                    <Grid item xs={12} style={{paddingBottom: 20}}>
                        <TextField label="Chart name" variant="outlined" helperText="For the graph legend" InputProps={{className: classes.chartName}}
                        InputLabelProps={{className: classes.dimWhite}} FormHelperTextProps={{className: classes.dimWhite}}
                        inputRef={nameRef} defaultValue={property.label} />
                    </Grid>
                </Grid>
                <Grid container direction="row" className={classes.morePadding}>
                    <Grid item sm={4} container alignItems="center">
                        <label>Point Color </label>
                        <input type="color" aria-label="Point color" defaultValue={property.options.points.color}
                        className={classes.colorInput} ref={pointColorRef} />
                    </Grid>
                    <Grid item sm={6} container alignItems="center">
                        <label>Max Point Radius</label>
                        <TextField type="text" defaultValue={property.options.points.maxRadius} inputRef={pointRadiusRef}
                        className={classes.numberInput} InputProps={{disableUnderline: true}} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Box mx="auto">
                    <Button className={classes.newButton} onClick={(e) => updateChart()}>
                        Update
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}