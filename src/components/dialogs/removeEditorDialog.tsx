import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, List, ListItem, ListItemIcon, ListItemText, Button} from '@material-ui/core'
import {useRef, useState, useMemo} from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

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
    deleteButton: {
        backgroundColor: 'hsla(348, 91%, 40%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(348, 91%, 40%, .9)'
        },
        margin: theme.spacing(1)
    },
    progressContainer: {
        position: 'absolute',
        top: '1rem',
        left: '1rem'
    },
    spinner: {
        color: 'hsl(301, 77%, 40%)'
    },
    redBorder: {
        border: '.1rem solid ' + theme.palette.error.main
    },
    redText: {
        color: theme.palette.error.main
    },
    border: {
        border: '.1rem solid hsla(241, 82%, 43%, .5)'
    },
    margin: {
        margin: '.5rem 0'
    }
}))

export default function RemoveEditorDialog({open, toggleOpen, editors, projectId}) {

    const [markedEditors, setMarkedEditors] = useState(editors.map(() => false))
    const [loading, setLoading] = useState(false)

    useMemo(() => setMarkedEditors(editors.map(() => false)), [editors])

    const closeDialog = () => {
        toggleOpen()
    }

    const toggleDeletion = (index:number) => {
        const copy = [...markedEditors]
        copy[index] = !copy[index]
        setMarkedEditors(copy)
    }

    const removeEditors = async () => {
        setLoading(true)
        const {remaining, deleted} = editors.reduce((result, comp, index) => {
            if(markedEditors[index]) {
                result.deleted.push(comp)
            } else {
                result.remaining.push(comp)
            }
            return result
        }, {remaining: [], deleted: []})
        const res = await fetch(`${process.env.API_ROUTE}/projects/removeeditors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                remaining,
                projectId
            })
        })
        setLoading(false)
        if(res.status !== 200) return
        toggleOpen(remaining)
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={closeDialog} aria-labelledby="Remove Editor(s)"
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: 'center'}} className={classes.textWhite}>Select Editors to Remove</DialogTitle>
            <DialogContent dividers={true}>
                <List>
                    {editors.map((editor, index) => (
                        <ListItem button className={`${markedEditors[index] ? classes.redBorder : classes.border} ${classes.margin}`}
                        key={index} onClick={(e) => toggleDeletion(index)}>
                            <ListItemIcon className={markedEditors[index] ? classes.redText : ''} >
                                <DeleteOutlineIcon />
                            </ListItemIcon>
                            <ListItemText style={{color: '#fff'}}>
                                {editor.username}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container justify="center">
                    <Button className={classes.deleteButton} onClick={() => removeEditors()}>
                        Remove Selected Editors
                    </Button>
                </Grid>
            </DialogActions>
            {loading && <div className={classes.progressContainer}>
                <CircularProgress classes={{svg: classes.spinner}} />
            </div>}
        </Dialog>
    )
}