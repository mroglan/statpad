import {makeStyles} from '@material-ui/core/styles'
import {Grid, Button, Typography, Box, Paper} from '@material-ui/core'
import Link from 'next/link'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles(theme => ({
    content: {
        backgroundColor: 'hsl(241, 82%, 50%)'
    },
    title: {
        color: '#fff',
        textAlign: 'center'
    },
    button: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)'
        },
    }
}))

export default function SuccessfulConfirmation() {

    const classes = useStyles()
    return (
        <Box mt={3} mx={3}>
            <Grid container>
                <Grid item style={{margin: '0 auto'}} xs={12} sm={6}>
                    <Paper className={classes.content}>
                        <Box textAlign="center" pt={3} color="hsl(140, 81%, 31%)">
                            <CheckCircleOutlineIcon fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h4" className={classes.title}>
                                Congratulations, your account is verified and you can now login!
                            </Typography>
                        </Box>
                        <Box mt={3} pb={3} textAlign="center">
                            <Link href="/login">
                                <a style={{textDecoration: 'none'}}>
                                    <Button className={classes.button} variant="contained">
                                        <Typography variant="h6" className={classes.title}>
                                            Login
                                        </Typography>
                                    </Button>
                                </a>
                            </Link>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}