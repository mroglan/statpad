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
    }
}))

export default function pieOptionsDialog({property, index, handlePropertyChange, handleOptionsClose, optionsSwitch}: OptionsInterface) {
    
    const classes = useStyles()
    return (
        <Dialog fullWidth open={optionsSwitch[index]} onClose={handleOptionsClose} aria-labelledby="scatter plot options"
        classes={{paper: classes.dialog}} >
            <DialogTitle style={{textAlign: 'center'}}>Chart Options</DialogTitle>
            <DialogContent>
                <Grid container direction="row">
                    <Grid item xs={12} style={{paddingBottom: 20}}>
                        <Typography variant="h6">
                            No options for this chart type currently...
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}