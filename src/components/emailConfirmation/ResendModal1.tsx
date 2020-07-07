import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core'
import {useRef, useState} from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
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
    }
}))

export default function ResendModal({open, toggleOpen}) {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])

    const sendConfirmation = async () => {
        if(loading) return
        setLoading(true)
        const res = await fetch(`${process.env.API_ROUTE}/auth/resendemail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
        })
        if(res.status === 200) {
            setLoading(false)
            toggleOpen()
            return
        }
        const json = await res.json()
        setLoading(false)
        setErrors(json)
    }

    const handleRemoveError = (index:number) => {
        setErrors([])
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={() => toggleOpen()} aria-labelledby="Resend Confirmation Dialog" 
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: "center"}} className={classes.textWhite}>Enter your Email</DialogTitle>
            <DialogContent>
                <Grid container>
                    {errors.map((error, index) => (
                        <Grid item xs={12} key={index} style={{margin: '2rem 0'}}>
                            <ErrorBox msg={error.msg} index={index} handleRemoveError={handleRemoveError} />
                        </Grid>
                    ))}
                </Grid>
                <Box mx={3} mb={3}>
                    <TextField label="Email" variant="outlined" InputProps={{className: classes.textWhite}}
                    InputLabelProps={{className: classes.dimWhite}} FormHelperTextProps={{className: classes.dimWhite}}
                    value={email} onChange={(e) => setEmail(e.target.value)} fullWidth /> 
                </Box>
            </DialogContent>
            <DialogActions>
                <Grid container justify="center">
                    <Button variant="contained" className={classes.newButton} onClick={() => sendConfirmation()}>
                        Resend Confirmation
                    </Button>
                </Grid>
            </DialogActions>
            {loading && <div className={classes.progressContainer}>
                <CircularProgress classes={{svg: classes.spinner}} />
            </div>}
        </Dialog>
    )
}