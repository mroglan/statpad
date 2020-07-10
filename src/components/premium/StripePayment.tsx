import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import {destroyCookie} from 'nookies'
import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Paper, Grid, Box, Typography, Button} from '@material-ui/core'
import ErrorBox from '../messageBox/ErrorBox'
import SuccessMessage from './SuccessMessage'
import addPremium from '../../requests/addPremium'
import removePremium from '../../requests/removePremium'
import addPremiumToJWT from '../../requests/addPremiumToJWT'

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: 'hsl(241, 92%, 60%)',
        position: 'relative',
        margin: '1rem 0',
        color: '#fff',
        padding: '1rem 5rem'
    },
    backButton: {
        backgroundColor: '#BEC3BE',
        '&:hover': {
            backgroundColor: '#939B93'
        }
    },
    submitButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
    }
}))

export default function StripePayment({paymentIntent, changeStep}) {

    const stripe = useStripe()
    const elements = useElements()

    const [checkoutErr, setCheckoutErr] = useState([])
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const submitPurchase = async () => {

        setLoading(true)

        try {  
            await addPremium()
            const {error, paymentIntent: {status}} = await stripe.confirmCardPayment(paymentIntent.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            })

            if(error) {
                await removePremium()
                throw new Error(error.message)
            }

            if(status === 'succeeded') {
                await addPremiumToJWT()
                destroyCookie(null, 'paymentIntentId', {
                    path: '/'
                })
                setCheckoutErr([])
                setCheckoutSuccess(true)
            }
            setLoading(false)
        } catch(e) {
            setLoading(false)
            setCheckoutErr([e.message])
        }
    }

    const handleRemoveError = (index:number) => {
        console.log('removing error')
        const copy = [...checkoutErr]
        copy.splice(index, 1)
        setCheckoutErr(copy)
    }

    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <Grid container justify="center">
                <Typography variant="h4" gutterBottom>Complete Payment</Typography>
            </Grid>
            <Grid container>
                {checkoutErr.map((error, index) => (
                    <Grid item xs={12} key={index} style={{marginBottom: '1rem'}}>
                        <ErrorBox msg={error} index={index} handleRemoveError={handleRemoveError} />
                    </Grid>
                ))}
            </Grid>
            {!checkoutSuccess ? <><Box pt={3}>
                <Box mb={2}>
                    <CardElement options={{style: {
                        base: {
                            fontSize: '16px',
                            color: '#fff',
                            '::placeholder': {
                                color: 'rgba(255, 255, 255, .8)'
                            },
                        },
                        invalid: {
                            color: '#f4422f'//'hsl(6, 90%, 57%)'
                        }
                    }}} />
                </Box>

            </Box>
            <Box mt={6}>
                <Grid container spacing={3} justify="space-between">
                    <Grid item>
                        <Button variant="contained" className={classes.backButton} onClick={() => changeStep(-1)}>
                            Back
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" className={classes.submitButton} onClick={() => submitPurchase()}
                        disabled={!stripe || loading} >
                            Purchase
                        </Button>
                    </Grid>
                </Grid>
            </Box></> : <Box>
                <SuccessMessage />
            </Box>}
        </Paper>
    )
}