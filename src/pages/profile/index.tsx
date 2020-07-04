import router from 'next/router'
import { GetServerSideProps, NextPageContext, GetServerSidePropsContext } from 'next'
import database from '../../database/database'
import getUser from '../../requests/getUser'
import Header from '../../components/nav/Header'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Paper, Button, Box, Typography, TextField, FormControl, OutlinedInput, CircularProgress,
    Snackbar, IconButton} from '@material-ui/core'
import {useState} from 'react'
import ErrorBox from '../../components/messageBox/ErrorBox'
import CloseIcon from '@material-ui/icons/Close'


const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    imgContainer: {
        borderRadius: '50%',
        width: 300,
        height: 300,
        [theme.breakpoints.down('sm')]: {
            width: 200,
            height: 200
        },
        overflow: 'hidden',
        border: '1px solid hsl(241, 82%, 45%)',
        margin: '0 auto',
        backgroundColor: 'hsl(241, 82%, 47%)',
    }, 
    profileImg: {
        minWidth: '100%',
        minHeight: '100%'
    },
    blankImg: {
        width: '100%',
        height: '100%'
    },
    paper: {
        backgroundColor: 'hsl(241, 82%, 47%)',
        padding: '1rem 0'
    },
    textWhite: {
        color: '#fff'
    },
    formControl: {

    },
    inputGridItem: {
        padding: '0 1rem'
    },
    newButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        }
    },
    spinner: {
        color: 'hsl(301, 77%, 40%)'
    },
    successMsg: {
        backgroundColor: theme.palette.success.main
    }
}))

export default function Profile({user}) {

    const [name, setName] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [error, setError] = useState([''])
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleRemoveError = (index:number) => {
        setError([''])
    }

    const updateProfile = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.API_ROUTE}/profile/updateprofile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user._id,
                username: name,
                email
            })
        })
        setLoading(false)
        if(res.status === 200) {
            setSuccess(true)
            return
        }
        const json = await res.json()
        setError([json])
    }

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={true} />
            <Grid container spacing={3}>
                <Grid item xs={6} sm={5} style={{margin: '0 auto'}}>
                    <Paper elevation={2} className={classes.imgContainer}>
                        <img className={user.image ? classes.profileImg : classes.blankImg} src={user.image || '/users/blankProfile.png'} />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={7}>
                    <Paper className={classes.paper}>
                        <Box>
                            {error[0] && <ErrorBox msg={error[0]} index={0} handleRemoveError={handleRemoveError} />}
                        </Box>
                        <Box my={2} px={3}>
                            <Grid container alignItems="center">
                                <Grid item xs={12} sm={12} md={4} lg={3} className={classes.inputGridItem}>
                                    <label htmlFor="username">
                                        <Typography variant="h5" className={classes.textWhite}>
                                            Username
                                        </Typography>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={9} className={classes.inputGridItem}>
                                    <FormControl fullWidth className={classes.formControl} variant="outlined">
                                        <OutlinedInput classes={{input: classes.textWhite}} id="username" value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={2} px={3}>
                            <Grid container alignItems="center">
                                <Grid item xs={12} sm={12} md={4} lg={3} className={classes.inputGridItem}>
                                    <label htmlFor="email">
                                        <Typography variant="h5" className={classes.textWhite}>
                                            Email
                                        </Typography>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={9} className={classes.inputGridItem}>
                                    <FormControl fullWidth className={classes.formControl} variant="outlined">
                                        <OutlinedInput classes={{input: classes.textWhite}} id="email" value={email}
                                        onChange={(e) => setEmail(e.target.value)} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box mt={3} px={3} textAlign="center">
                            <Button variant="contained" className={classes.newButton} onClick={(e) => updateProfile()} >
                                {loading ? <Grid container alignItems="center" ><CircularProgress classes={{svg: classes.spinner}} size={20} /> Updating</Grid> : 'Update Profile'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} open={success} onClose={(e) => setSuccess(false)}
            message="Profile Updated" autoHideDuration={6000} ContentProps={{classes: {
                root: classes.successMsg
            }}} action={
                <IconButton size="small" aria-label="close" onClick={(e) => setSuccess(false)} style={{color: '#fff'}} >
                    <CloseIcon />
                </IconButton>
            } />
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user = await getUser(ctx)

    return {props: {user}}
}