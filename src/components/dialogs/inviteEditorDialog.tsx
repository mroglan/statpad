import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, TextField, Button, Radio} from '@material-ui/core'
import {createRef, useState} from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import {ChangeEvent} from 'react'

const useStyles = makeStyles(theme => ({
    dialog: {
        backgroundColor: 'hsl(241, 82%, 60%)',
    },
    textWhite: {
        color: '#fff'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .5)'
    },
    label: {
        color: 'hsl(241, 52%, 80%)'
    },
    newButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        }
    },
    progressContainer: {
        position: 'absolute',
        top: '1rem',
        left: '1rem'
    },
    spinner: {
        color: 'hsl(301, 77%, 40%)'
    },
    inviteButton: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)'
        },
        margin: theme.spacing(1)
    }
}))

export default function InviteEditorDialog({open, toggleOpen, editors, projectId, userId}) {
    
    const [inputs, setInputs] = useState([''])

    const closeDialog = () => {
        toggleOpen(null)
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={closeDialog} aria-labelledby="Add Editor Dialog" 
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: "center"}} className={classes.textWhite}>Add Editors</DialogTitle>
            <DialogContent>
                <Box mx={3} mb={3}>
                    <Button className={classes.inviteButton} variant="contained">
                        Add Input
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}