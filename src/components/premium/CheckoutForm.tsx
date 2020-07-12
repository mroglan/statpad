import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import {destroyCookie} from 'nookies'
import {useState} from 'react'

export default function CheckoutFrom({paymentIntent}) {

    const stripe = useStripe()
    const elements = useElements()

    const [checkoutErr, setCheckoutErr] = useState('')
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const {error, paymentIntent: {status}} = await stripe.confirmCardPayment(paymentIntent.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            })

            if(error) throw new Error(error.message)

            if(status === 'succeeded') {
                destroyCookie(null, 'paymentIntentId', {
                    path: '/'
                })
                setCheckoutSuccess(true)
            }
        } catch(e) {
            setCheckoutErr(e.message)
        }
    }

    if(checkoutSuccess) {
        return <p>Payment Successful!!</p>
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay now
            </button>

            {checkoutErr && <span style={{color: 'red'}}>{checkoutErr}</span>}
        </form>
    )
}