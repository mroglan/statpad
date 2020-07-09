import {makeStyles, withStyles} from '@material-ui/core/styles'
import {Paper, Grid, Typography, Box, FormGroup, Button, TextField, FormControlLabel, Checkbox} from '@material-ui/core'
import ErrorBox from '../messageBox/ErrorBox'
import {useState} from 'react'

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: 'hsl(241, 92%, 60%)',
        position: 'relative',
        margin: '1rem 0',
        color: '#fff',
        padding: '1rem 5rem'
    },
    submitButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
    },
    errorText: {
        color: 'hsl(6, 90%, 57%)'
    },
    option: {
        backgroundColor: 'hsl(241, 92%, 55%)',
        border: '2px solid rgba(255, 255, 255, .8)',
        cursor: 'pointer',
    },
    selected: {
        border: '2px solid ' + theme.palette.success.main
    },
    textWhite: {
        color: '#fff'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .8)'
    },
    backButton: {
        backgroundColor: '#BEC3BE',
        '&:hover': {
            backgroundColor: '#939B93'
        }
    }
}))

interface Props {
    paymentMethod: string;
    setPaymentMethod: any;
    changeStep: any;
}

export default function PaymentMethod({paymentMethod, setPaymentMethod, changeStep}:Props) {

    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <Grid container justify="center">
                <Typography variant="h4" gutterBottom>Select a Payment Method</Typography>
            </Grid>
            <Box pt={3}>
                <Box mb={3} px={3} py={1} borderRadius={10} className={`${paymentMethod === 'paypal' ? classes.selected : ''} ${classes.option}`}
                onClick={() => setPaymentMethod('paypal')} >
                    <Typography variant="h6" className={paymentMethod === 'paypal' ? classes.textWhite : classes.dimWhite}>
                        Paypal
                    </Typography>
                </Box>
                <Box mb={3} px={3} py={1} borderRadius={10} className={`${paymentMethod === 'stripe' ? classes.selected : ''} ${classes.option}`}
                onClick={() => setPaymentMethod('stripe')} >
                    <Typography variant="h6" className={paymentMethod === 'stripe' ? classes.textWhite : classes.dimWhite}>
                        Credit/Debit Card
                    </Typography>
                </Box>
                <Box mt={6}>
                    <Grid container spacing={3} justify="space-between">
                        <Grid item>
                            <Button variant="contained" className={classes.backButton} onClick={() => changeStep(-1)}>
                                Back
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" className={classes.submitButton} onClick={() => changeStep(1)}
                            disabled={!Boolean(paymentMethod)} >
                                Continue
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    )
}