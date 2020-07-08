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
}))

interface NewInfo {
    name: string;
}

type ToggleOpen = (editIndex:number, newInfo?:NewInfo) => void

interface Props {
    open: boolean;
    toggleOpen: ToggleOpen;
    component: {
        _id: string;
        project: string;
        name: string;
        type: string;
        createDate: string;
        updateDate: string;
        data?: any;
        graphs?:any;
        tests?: any;
        intervals?: any;
    };
    index: number;
}

export default function EditComponentDialog({open, toggleOpen, component, index}:Props) {

    const [name, setName] = useState(component.name)
    const [loading, setLoading] = useState(false)

    const closeDialog = () => toggleOpen(index)

    const changeName = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value)
    }

    const editComponent = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.API_ROUTE}/projects/updatecomponent`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: component._id,
                name
            })
        })
        setLoading(false)
        if(res.status !== 200) return
        toggleOpen(index, {name})
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={closeDialog} aria-labelledby="Edit Component"
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: 'center'}} className={classes.textWhite}>Edit Component</DialogTitle>
            <DialogContent dividers={true}>
                <Box py={5}>
                    <TextField fullWidth label="Component name" variant="outlined" InputProps={{className: classes.textWhite}}
                    InputLabelProps={{className: classes.dimWhite}} value={name} onChange={(e) => changeName(e)} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Grid container justify="center">
                    <Button className={classes.editButton} onClick={(e) => editComponent()}>
                        Edit Component
                    </Button>
                </Grid>
            </DialogActions>
            {loading && <div className={classes.progressContainer}>
                <CircularProgress classes={{svg: classes.spinner}} />
            </div>}
        </Dialog>
    )
}