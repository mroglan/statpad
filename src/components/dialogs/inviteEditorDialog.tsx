import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, TextField, Button, Radio, IconButton, FormControl, OutlinedInput} from '@material-ui/core'
import {createRef, useState, ChangeEvent, useMemo} from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ErrorBox from '../messageBox/ErrorBox'

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
    },
    deleteButton: {
        opacity: .5,
        color: theme.palette.error.dark,
        '&:hover': {
            background: 'none',
            opacity: 1,
            transform: 'scale(1.1)'
        }
    },
}))

export default function InviteEditorDialog({open, toggleOpen, editors, projectId, userId}) {
    
    const [inputs, setInputs] = useState([''])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])

    useMemo(() => setInputs(['']), [editors])

    const closeDialog = () => {
        toggleOpen(null)
    }

    const updateInputs = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, index:number) => {
        const copy = [...inputs]
        copy[index] = e.target.value
        setInputs(copy)
    }

    const addInput = () => {
        setInputs(currentInputs => [...currentInputs, ''])
    }

    const deleteInput = (index:number) => {
        const copy = [...inputs]
        copy.splice(index, 1)
        setInputs(copy)
    }

    const handleRemoveError = (index:number) => {
        const copy = [...errors]
        copy.splice(index, 1)
        setErrors(copy)
    }

    const addEditors = async () => {
        const duplicate = editors.find(editor => inputs.includes(editor.username))
        if(duplicate) {
            setErrors([{msg: `${duplicate.username} is already an editor!`}])
            return 
        }
        setLoading(true)
        const res = await fetch(`${process.env.API_ROUTE}/projects/addeditor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId,
                newEditors: inputs,
                currentEditors: editors
            })
        })
        const json = await res.json()
        setLoading(false)
        if(res.status === 200) {
            console.log('json', json)
            return toggleOpen(json)
        }
        setErrors(json)
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={closeDialog} aria-labelledby="Add Editor Dialog" 
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: "center"}} className={classes.textWhite}>Add Editors</DialogTitle>
            <DialogContent dividers={true}>
                <Box mx={3} mb={3}>
                    <Button className={classes.inviteButton} variant="contained"
                    onClick={() => addInput()} >
                        Add Input
                    </Button>
                </Box>
                {errors.map((error, index) => (
                    <Box mx={3} mb={3} key={index}>
                        <ErrorBox msg={error.msg} index={index} handleRemoveError={handleRemoveError} />
                    </Box>
                ))}
                {inputs.map((input, index) => (
                    <Box mx={3} mb={3} key={index}>
                        <Grid container spacing={3} wrap="nowrap" alignItems="center">
                            <Grid item>
                                <IconButton className={classes.deleteButton} onClick={() => deleteInput(index)} >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </Grid>
                            <Grid item style={{flexGrow: 1}}>
                                <FormControl fullWidth variant="outlined">
                                    <OutlinedInput classes={{input: classes.textWhite}} value={input}
                                    placeholder="username" onChange={(e) => updateInputs(e, index)} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Grid container justify="center">
                    <Button className={classes.newButton} variant="contained" onClick={() => addEditors()}>
                        Add Editors
                    </Button>
                </Grid>
            </DialogActions>
            {loading && <div className={classes.progressContainer}>
                <CircularProgress classes={{svg: classes.spinner}} />
            </div>}
        </Dialog>
    )
}