import {makeStyles} from '@material-ui/core/styles'
import {Grid, Box} from '@material-ui/core'
import Header from '../../components/nav/Header'
import Stripe from 'stripe'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import getUser from '../../requests/getUser'
import {parseCookies, setCookie} from 'nookies'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import CheckoutForm from '../../components/premium/CheckoutForm'
import CheckoutWizard from '../../components/premium/CheckoutWizard'
import {Formik, Form, Field, useField} from 'formik'
import {useState} from 'react'

const stripePromise = loadStripe('pk_test_51H2lxQLlQTQgAaZ3198eMV8xPTLSm3dGXTbMk47SJhH3PbVglO5pLfluhm3FLLlkgfnd7ogeCACRk2XHZgMgxteZ00JlPgUFme')

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    }
}))

export default function Checkout({user, paymentIntent}) {

    const [basicInfo, setBasicInfo] = useState({
        firstName: '',
        lastName: '',
        acceptedTermsAndConditions: false
    })

    const [paymentMethod, setPaymentMethod] = useState('')

    const [currentStep, setCurrentStep] = useState(user ? 1 : 0)

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={true} user={user} />
            <Grid container>
                <Grid item style={{margin: '0 auto'}} xs={12} sm={10} md={8}>
                    <Box my={3}>
                        <CheckoutWizard currentStep={currentStep} />
                    </Box>
                    <Box my={3}>
                        
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user:any = await getUser(ctx)
    if(!user) return {props: {}}

    const stripe = new Stripe('sk_test_51H2lxQLlQTQgAaZ3g4KzwMFlcvz64iGJtyUcJdV8b5Xl460I76gtIhfC4AC3SAs9eyVvi1PMEHhLVQWfqtkL08tH00FuxE9oGS', {
        apiVersion: '2020-03-02'
    })

    let paymentIntent;

    const {paymentIntentId}  = await parseCookies(ctx)

    if(paymentIntentId) {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        return {props: {
            user, paymentIntent
        }}
    }

    paymentIntent = await stripe.paymentIntents.create({
        amount: 499,
        currency: 'USD'
    })

    setCookie(ctx, 'paymentIntentId', paymentIntent.id, {
        path: '/'
    })

    return {props: {
        user, paymentIntent
    }}
}