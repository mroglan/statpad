import {makeStyles} from '@material-ui/core/styles'
import {Grid, Button, Typography, Box, Paper} from '@material-ui/core'
import Link from 'next/link'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ResendModal from '../../components/emailConfirmation/ResendModal1'
import Header from '../../components/nav/Header'
import {useState} from 'react'
import Head from 'next/head'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    content: {
        backgroundColor: 'hsl(241, 82%, 50%)'
    },
    title: {
        color: '#fff',
        textAlign: 'center'
    },
    textWhite: {
        color: '#fff'
    },
    button: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)'
        },
    }
}))

export default function ResendEmail() {

    const [viewResendModal, setViewResendModal] = useState(false)

    const toggleResendModal = () => setViewResendModal(!viewResendModal)

    const classes = useStyles()
    return (
        <>
        <Head>
            <title>Resend Confirmation Email | Statpad</title>
            <link rel="icon" type="image/png" href="https://res.cloudinary.com/dqtpxyaeo/image/upload/v1594509878/webpage/kbe7kwyavz3ye7fxamnl.png" />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={false} user={null} />
            <Box mt={3} mx={3}>
                <Grid container>
                    <Grid item style={{margin: '0 auto'}} xs={12} sm={6}>
                        <Paper className={classes.content}>
                            <Box px={2}>
                                <Typography variant="h4" className={classes.title}>
                                    Resend Confirmation Email
                                </Typography>
                                <Typography variant="h6" className={classes.textWhite}>
                                    Make sure to check your spam folder...
                                </Typography>
                            </Box>
                            <Box mt={3} pb={3} textAlign="center">
                                <Button className={classes.button} variant="contained" onClick={() => toggleResendModal()}>
                                    <Typography variant="h6" className={classes.title}>
                                        Resend Confirmation
                                    </Typography>
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <ResendModal open={viewResendModal} toggleOpen={toggleResendModal} />
        </div>
        </>
    )
}