import {useState, useEffect, useRef} from 'react'
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

declare global {
    interface Window {paypal: any}
}

export default function PaypalPayment({changeStep, paypalLoaded}) {

    const [checkoutErr, setCheckoutErr] = useState([])
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const paypalRef = useRef()

    const updateAccount = async () => {
        await Promise.all([
            addPremium(), addPremiumToJWT()
        ])
    }

    useEffect(() => {
        console.log('ran...')
        if(!paypalLoaded) return
        if(window.paypal) console.log('there is a window.paypal')
        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            description: 'The premium version for statpad',
                            amount: {
                                currency_code: 'USD',
                                value: '4.99'
                            }
                        }
                    ]
                })
            }, 
            onApprove: async (data, actions) => {
                //const order = await actions.order.capture()
                await updateAccount()
                setCheckoutSuccess(true)
                //console.log(order)
            },
            onError: err => {
                setCheckoutErr(['An error occured during checkout'])
            }
        }).render(paypalRef.current)
    }, [paypalLoaded])  

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
            {!checkoutSuccess ? <>
                <Box pt={3}>
                    <div ref={paypalRef} />
                </Box>
                <Box mt={6}>
                <Grid container spacing={3} justify="center">
                    <Grid item>
                        <Button variant="contained" className={classes.backButton} onClick={() => changeStep(-1)}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            </> : <Box>
                <SuccessMessage />
            </Box>}
        </Paper>    
    )
}