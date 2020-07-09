import Head from 'next/head'
import {makeStyles} from '@material-ui/core/styles'
import {useState, useEffect} from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    }
}))

export default function Premium() {

    const [isEnabled, setIsEnabled] = useState(false)

    

    const classes = useStyles()
    return (
        <div className={classes.root}>
            Hello World
            <div>
                {isEnabled ? <div id="paypal-btn" /> : 'Loading...'}
            </div>
        </div>
    )
}