import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, TextField, Button, Radio} from '@material-ui/core'
import {useRef, useState} from 'react'
import Router from 'next/router'
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
    progressContainer: {
        position: 'absolute',
        top: '1rem',
        left: '1rem'
    },
    spinner: {
        color: 'hsl(301, 77%, 40%)'
    },
    gridItem: {
        marginBottom: '2rem'
    },
    editButton: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)'
        },
    },
    radio: {
        '&$checked': {
            color: theme.palette.success.main
        }
    },
    checked: {},
}))

interface NewInfo {
    name: string;
    description: string;
}

type ToggleOpen = (editIndex:number, newInfo?:NewInfo, index?:number) => void

interface Props {
    open: boolean;
    toggleOpen: ToggleOpen;
    project: {
        _id: string;
        owner: string;
        editors: string[];
        name: string;
        description: string;
        createDate: string;
        updateDate: string;
        public: boolean;
    };
    index: number;
}

export default function EditProjectDialog({open, toggleOpen, project, index}:Props) {

    const [name, setName] = useState(project.name)
    const [description, setDescription] = useState(project.description)
    const [isPublic, setPublic] = useState(project.public)
    const [loading, setLoading] = useState(false)

    const closeDialog = () => toggleOpen(index)

    const changeName = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value)
    }

    const changeDesc = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    const editProject = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.API_ROUTE}/projects/updateproject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: project._id,
                name,
                description,
                public: isPublic
            })
        })
        setLoading(false)
        if(res.status !== 200) return
        toggleOpen(index, {
            name, description
        })
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={closeDialog} aria-labelledby="Edit project"
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: 'center'}} className={classes.textWhite}>Edit Project</DialogTitle>
            <DialogContent dividers={true}>
                <Grid container direction="column">
                    <Grid item className={classes.gridItem}>
                        <TextField label="Project name" variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}} value={name} onChange={(e) => changeName(e)} />
                    </Grid>
                    <Grid item className={classes.gridItem}>
                        <TextField fullWidth label="Project Description" variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}} value={description} onChange={(e) => changeDesc(e)} />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Grid container direction="row" wrap="nowrap" alignItems="center">
                            <Grid item>
                                <Radio value={true} checked={isPublic} onClick={(e) => setPublic(true)}
                                classes={{root: classes.radio, checked: classes.checked}} />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" className={classes.textWhite}>
                                    Public
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container direction="row" wrap="nowrap" alignItems="center">
                            <Grid item>
                                <Radio value={false} checked={!isPublic} onClick={(e) => setPublic(false)}
                                classes={{root: classes.radio, checked: classes.checked}} />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" className={classes.textWhite}>
                                    Private
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container justify="center">
                    <Button className={classes.editButton} onClick={(e) => editProject()} >
                        Edit Project
                    </Button>
                </Grid>
            </DialogActions>
            {loading && <div className={classes.progressContainer}>
                <CircularProgress classes={{svg: classes.spinner}} />
            </div>}
        </Dialog>
    )
}