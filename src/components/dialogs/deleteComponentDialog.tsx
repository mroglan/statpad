import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, List, ListItem, ListItemIcon, ListItemText, Button} from '@material-ui/core'
import {useRef, useState, useMemo} from 'react'
import Router from 'next/router'
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

export default function DeleteComponentDialog({open, toggleOpen, components, projectId}) {

    const [deletionComps, setDeletionComps] = useState(components.map(comp => false))
    const [loading, setLoading] = useState(false)

    useMemo(() => setDeletionComps(components.map(() => false)), [open])

    const closeDialog = () => {
        toggleOpen(null)
    }

    const toggleDeletion = (index:number) => {
        const copy = [...deletionComps]
        copy[index] = !copy[index]
        setDeletionComps(copy)
    }

    const deleteComponents = async () => {
        setLoading(true) 
        const {remaining, deleted} = components.reduce((result, comp, index) => {
            if(deletionComps[index]) {
                result.deleted.push(comp)
            } else {
                result.remaining.push(comp)
            }
            return result
        }, {remaining: [], deleted: []})
        const res = await fetch(`${process.env.API_ROUTE}/projects/deletecomponents`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deleteComps: deleted
            })
        })
        setLoading(false)
        if(res.status !== 200) return
        toggleOpen(remaining)
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={closeDialog} aria-labelledby="Delete Component(s)"
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: 'center'}} className={classes.textWhite}>Select Components to Delete</DialogTitle>
            <DialogContent dividers={true}>
                <List>
                    {components.map((component, index:number) => (
                        <ListItem button className={`${deletionComps[index] ? classes.redBorder : classes.border} ${classes.margin}`} 
                        key={index} onClick={(e) => toggleDeletion(index)} >
                            <ListItemIcon className={deletionComps[index] ? classes.redText : ''} >
                                <DeleteOutlineIcon />
                            </ListItemIcon>
                            <ListItemText style={{color: '#fff'}}>
                                {component.name}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container justify="center">
                    <Button className={classes.deleteButton} onClick={(e) => deleteComponents()} >
                        Delete Selected Components
                    </Button>
                </Grid>
            </DialogActions>
            {loading && <div className={classes.progressContainer}>
                <CircularProgress classes={{svg: classes.spinner}} />
            </div>}
        </Dialog>
    )
}