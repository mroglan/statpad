import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import {useTransition, animated, interpolate} from 'react-spring'
import {useState, useCallback, useEffect} from 'react'

const useStyles = makeStyles(theme => ({
    typo: {
        color: '#fff',
        textShadow: '1px 1px 3px #000',
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('sm')]: {
            fontSize: '2rem'
        }, 
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.5rem'
        }
    }
}))

const info = [
    'Scatter Plots',
    'Bar Charts',
    'Histograms',
    'Bubble Charts',
    'Pie Charts',
    'Polar Area Charts',
    'Simulations',
    'Tree Diagrams',
    'Two Way Tables',
    'Binomial Probability',
    'Geometric Probability',
    '1 Sample Confidence Intervals',
    '2 Sample Confidence Intervals',
    'Regression Confidence Intervals',
    '1 Sample Hypothesis Tests',
    '2 Sample Hypothesis Tests',
    'Regression Hypothesis Tests'
]

export default function InfoCarousel() {
    
    const AnimatedTypo = animated(Typography)

    const [index, setIndex] = useState(0)

    const transitions = useTransition(index, p => p, {
        from: {opacity: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)'},
        enter: {opacity: 1},
        leave: {opacity: 0}
    })
    
    useEffect(() => {
        setTimeout(() => {
            setIndex(index => index + 1 === info.length ? 0 : index + 1)
            console.log('setTimeout called')
        }, 2500)
    }, [index])

    const classes = useStyles()
    return (
        <Box style={{overflow: 'visible'}}>
            {transitions.map(({item, key, props}) => {
                return <AnimatedTypo className={classes.typo} variant="h2" key={key} style={props}>{info[item]}</AnimatedTypo>
            })}
        </Box>
    )
}