import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, TextField, Button, FormControlLabel, Switch} from '@material-ui/core'
import OptionsInterface from './optionsInterface'
import {useRef, useMemo, useState, createRef} from 'react'

const useStyles = makeStyles(theme => ({
    dialog: {
        backgroundColor: 'hsl(241, 82%, 60%)',
        color: '#fff'
    },
    chartName: {
        color: '#fff',
    },
    textWhite: {
        color: '#fff'
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
    windowInput: {
        marginLeft: '1rem',
        paddingLeft: '.5rem',
        paddingRight: '.5rem',
        border: '1px solid black',
        maxWidth: '5rem',
        '& input': {
            color: '#fff'
        }
    },
    windowSettingsContainer: {
        padding: '1rem 0'
    }
}))

export default function graphOptionsDialog({property, index, handlePropertyChange, handleOptionsClose, optionsSwitch}: OptionsInterface) {

    const [legendVisible, setLegendVisible] = useState(property.legend.display)

    const windowRefs = {
        xMin: createRef<HTMLInputElement>(),
        xMax: createRef<HTMLInputElement>(),
        xScl: createRef<HTMLInputElement>(),
        yMin: createRef<HTMLInputElement>(),
        yMax: createRef<HTMLInputElement>(),
        yScl: createRef<HTMLInputElement>()
    }

    const updateGraph = () => {
        const propertyCopy = {...property}
        propertyCopy.axis.ticks = {
            xMin: windowRefs.xMin.current.value.trim(),
            xMax: windowRefs.xMax.current.value.trim(),
            xScl: windowRefs.xScl.current.value.trim(),
            yMin: windowRefs.yMin.current.value.trim(),
            yMax: windowRefs.yMax.current.value.trim(),
            yScl: windowRefs.yScl.current.value.trim()
        }
        propertyCopy.legend.display = legendVisible
        handlePropertyChange(propertyCopy)
        handleOptionsClose()
    }

    useMemo(() => {
        setLegendVisible(property.legend.display)
    }, [property])

    const LegendsSwitch = withStyles((theme) => ({
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

    const handleLegendDisplayChange = (e:any) => {
        setLegendVisible(!legendVisible)
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={optionsSwitch[index]} onClose={handleOptionsClose} aria-labelledby="scatter plot options"
        classes={{paper: classes.dialog}} >
            <DialogTitle style={{textAlign: 'center'}}>Graph Options</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <Grid item xs={12} style={{paddingBottom: 20}}>
                        <FormControlLabel control={<LegendsSwitch onChange={(e) => handleLegendDisplayChange(e)} 
                        checked={legendVisible} name="Display legend" />} 
                        label="Display Legend" labelPlacement="end" classes={{label: classes.textWhite}} />
                    </Grid>
                    <Grid item container xs={12} direction="row">
                        <Grid item container sm={4} direction="column">
                            <Grid item container alignItems="center" className={classes.windowSettingsContainer}>
                                <Grid item xs={3}>
                                    X-min:
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField type="text" placeholder={'Auto'} inputRef={windowRefs.xMin}
                                    className={classes.windowInput} InputProps={{ disableUnderline: true }}
                                    defaultValue={property.axis.ticks.xMin} />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems="center" className={classes.windowSettingsContainer}>
                                <Grid item xs={3}>
                                    Y-min:
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField type="text" placeholder={'Auto'} inputRef={windowRefs.yMin}
                                    className={classes.windowInput} InputProps={{disableUnderline: true}}
                                    defaultValue={property.axis.ticks.yMin} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container sm={4} direction="column">
                            <Grid item container alignItems="center" className={classes.windowSettingsContainer}>
                                <Grid item xs={3}>
                                    X-max:
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField type="text" placeholder={'Auto'} inputRef={windowRefs.xMax}
                                    className={classes.windowInput} InputProps={{disableUnderline: true}}
                                    defaultValue={property.axis.ticks.xMax} />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems="center" className={classes.windowSettingsContainer}>
                                <Grid item xs={3}>
                                    Y-max:
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField type="text" placeholder={'Auto'} inputRef={windowRefs.yMax}
                                    className={classes.windowInput} InputProps={{disableUnderline: true}}
                                    defaultValue={property.axis.ticks.yMax} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container sm={4} direction="column">
                            <Grid item container alignItems="center" className={classes.windowSettingsContainer}>
                                <Grid item xs={3}>
                                    X-scl:
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField type="text" placeholder={'Auto'} inputRef={windowRefs.xScl}
                                    className={classes.windowInput} InputProps={{disableUnderline: true}}
                                    defaultValue={property.axis.ticks.xScl} />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems="center" className={classes.windowSettingsContainer}>
                                <Grid item xs={3}>
                                    Y-scl:
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField type="text" placeholder={'Auto'} inputRef={windowRefs.yScl}
                                    className={classes.windowInput} InputProps={{disableUnderline: true}}
                                    defaultValue={property.axis.ticks.yScl} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Box mx="auto">
                    <Button className={classes.newButton} onClick={(e) => updateGraph()} >
                        Update
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}