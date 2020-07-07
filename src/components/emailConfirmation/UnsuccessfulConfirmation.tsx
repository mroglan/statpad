import {makeStyles} from '@material-ui/core/styles'
import {Grid, Button, Typography, Box, Paper} from '@material-ui/core'
import Link from 'next/link'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

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

export default function UnsuccessfulConfirmation() {

    const classes = useStyles()
    return (
        <Box mt={3} mx={3}>
            <Grid container>
                <Grid item style={{margin: '0 auto'}} xs={12} sm={6}>
                    <Paper className={classes.content}>
                        <Box textAlign="center" pt={3} color="#ff1744">
                            <ErrorOutlineIcon fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h4" className={classes.title}>
                                Oops, something went wrong. Try resending the confirmation to your email and try again.
                            </Typography>
                        </Box>
                        <Box mt={3} pb={3} textAlign="center">
                            <Button className={classes.button} variant="contained">
                                <Typography variant="h6" className={classes.title}>
                                    Resend Confirmation
                                </Typography>
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}