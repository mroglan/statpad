import {makeStyles} from '@material-ui/core/styles'
import {Grid, Box} from '@material-ui/core'
import Header from '../../components/nav/Header'
import Stripe from 'stripe'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import getUser from '../../requests/getUser'
import authenticated from '../../requests/authenticated'
import {parseCookies, setCookie} from 'nookies'
import {loadStripe} from '@stripe/stripe-js'
import CheckoutWizard from '../../components/premium/CheckoutWizard'
import BasicInfo from '../../components/premium/BasicInfo'
import PaymentMethod from '../../components/premium/PaymentMethod'
import StripePayment from '../../components/premium/StripePayment'
import PaypalPayment from '../../components/premium/PaypalPayment'
import SignIn from '../../components/premium/SignIn'
import {Formik, Form, Field, useField} from 'formik'
import {useState, useEffect} from 'react'
import {Elements} from '@stripe/react-stripe-js'
import Head from 'next/head'

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY)

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    }
}))

export default function Checkout({loggedIn, user, paymentIntent}) {

    const [basicInfo, setBasicInfo] = useState({
        firstName: '',
        lastName: '',
        acceptedTermsAndConditions: false
    })

    const [paymentMethod, setPaymentMethod] = useState('')

    const [currentStep, setCurrentStep] = useState(user ? 1 : 0)

    const changeStep = (change:number) => {
        setCurrentStep(currentStep + change)
    }

    const [paypalLoaded, setPaypalLoaded] = useState(false)

    useEffect(() => {
        const script = document.createElement('script')
        script.src = `https://www.paypal.com/sdk/js?client-id=AVYpz29sdqSyZfiluamc1N-qPLCOx4UYkIK1Zg373QKDUz4obiXHcx4P_8IX8iw1FDB2Eq1kNXXIiRsg`

        script.addEventListener('load', () => setPaypalLoaded(true))
        document.body.append(script)
    }, [])

    const classes = useStyles()
    return (
        <>
        <Head>
            <title>Purchase Premium | Statpad</title>
            <meta name="description" content="Purchase the most epic Premium Account you will ever see for only $4.99!!!" />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            <Grid container>
                <Grid item style={{margin: '0 auto'}} xs={12} sm={10} md={8}>
                    <Box my={3}>
                        <CheckoutWizard currentStep={currentStep} />
                    </Box>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item style={{margin: '0 auto'}} xs={12} sm={8} md={6} >
                    <Box>
                        {currentStep === 0 ? <SignIn changeStep={changeStep} /> : 
                        currentStep === 1 ? <BasicInfo info={basicInfo} setInfo={setBasicInfo} changeStep={changeStep} /> : 
                        currentStep === 2 ? <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} changeStep={changeStep} /> : 
                        paymentMethod === 'stripe' ? <Elements stripe={stripePromise}><StripePayment paymentIntent={paymentIntent} changeStep={changeStep} /></Elements> : 
                        paymentMethod === 'paypal' ? <PaypalPayment changeStep={changeStep} paypalLoaded={paypalLoaded} /> : 'Wow something is wrong'}
                    </Box>
                </Grid>
            </Grid>
        </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    const user:any = isAuth ? await getUser(ctx) : null

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-03-02'
    })

    let paymentIntent;

    const {paymentIntentId}  = await parseCookies(ctx)

    if(paymentIntentId) {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        return {props: {
            loggedIn: isAuth, user, paymentIntent
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
        loggedIn: isAuth, user, paymentIntent
    }}
}

//redeploy