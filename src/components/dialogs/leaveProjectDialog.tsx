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

export default function LeaveProjectDialog({open, toggleOpen, projects, owner}) {

    const [deletedProjects, setDeletedProjects] = useState(projects.map(project => false))
    const [loading, setLoading] = useState(false)

    useMemo(() => {
        console.log('using memo')
        setDeletedProjects(projects.map(() => false))
    }, [open])

    const closeDialog = () => {
        toggleOpen(null)
    }

    const toggleDeletion = (index:number) => {
        const copy = [...deletedProjects]
        copy[index] = !copy[index]
        setDeletedProjects(copy)
    }

    const leaveProjects = async () => {
        setLoading(true) 
        const {remaining, deleted} = projects.reduce((result, comp, index) => {
            if(deletedProjects[index]) {
                result.deleted.push(comp)
            } else {
                result.remaining.push(comp)
            }
            return result
        }, {remaining: [], deleted: []})
        const res = await fetch(`${process.env.API_ROUTE}/projects/leaveprojects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                leaving: deleted,
                userId: owner
            })
        })
        setLoading(false)
        if(res.status !== 200) return
        toggleOpen(remaining)
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={closeDialog} aria-labelledby="Leave Project(s)"
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: 'center'}} className={classes.textWhite}>Select Projects to Leave</DialogTitle>
            <DialogContent dividers={true}>
                <List>
                    {projects.map((project, index:number) => (
                        <ListItem button className={`${deletedProjects[index] ? classes.redBorder : classes.border} ${classes.margin}`} 
                        key={index} onClick={(e) => toggleDeletion(index)} style={{display: project.owner === owner ? 'none' : ''}} >
                            <ListItemIcon className={deletedProjects[index] ? classes.redText : ''} >
                                <DeleteOutlineIcon />
                            </ListItemIcon>
                            <ListItemText style={{color: '#fff'}}>
                                {project.name}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container justify="center">
                    <Button className={classes.deleteButton} onClick={(e) => leaveProjects()} >
                        Leave Selected Projects
                    </Button>
                </Grid>
            </DialogActions>
            {loading && <div className={classes.progressContainer}>
                <CircularProgress classes={{svg: classes.spinner}} />
            </div>}
        </Dialog>
    )
}