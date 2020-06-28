import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import {useMove} from 'react-use-gesture'
import {useSprings, animated, interpolate} from 'react-spring'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    bar: {
        backgroundColor: 'transparent', //'hsl(241, 82%, 85%)',
        width: '100%',
        flexBasis: '20%',
        borderLeft: '2.5px solid hsl(241, 82%, 43%)',
        borderRight: '2.5px solid hsl(241, 82%, 43%)'
    },
    barsContainer: {
        backgroundImage: 'linear-gradient(to right, hsl(299, 50%, 46%), hsl(355, 81%, 55%))',
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
            height: 200
        },
        [theme.breakpoints.up('lg')]: {
            width: '25%',
            height: 300
        },
    },
    lightWhite: {
        color: theme.palette.primary.light
    }
}))

const toHeight = (index:number) => ({height: 20 * index})

export default function Manual({loggedIn}) {

    const AnimatedBar = animated(Grid)

    const [bars, setBars] = useSprings<any>(5, i => ({...toHeight(i), from: {height: 0}}))

    const horzMovementBind = useMove(({xy: [x]}) => {
        // compare window.innerWidth - 48 to x - 24

        const mousePercent = (x - 24) / (window.innerWidth - 48)

        setBars((i:number) => {
            const percentDifference = 100 - (Math.abs(mousePercent - ((i + 1) / 5)) * 100)
            return {height: percentDifference}
        })
    })

    const classes = useStyles()
    return (
        <div className={classes.root} {...horzMovementBind()}>
            <Header loggedIn={loggedIn} />
            <Box>
                <Grid container direction="row" wrap="nowrap" alignItems="flex-end" justify="space-around"
                className={classes.barsContainer} style={{margin: '0 auto'}}>
                    {bars.map(({height}, index:number) => (
                        <Grid item key={index} className={classes.bar} style={{height: '100%'}}>
                            <Grid container direction="column" style={{height: '100%'}}>
                                <Grid item style={{flexGrow: 1, flexBasis: 0, backgroundColor: 'hsl(241, 82%, 43%)'}} />
                                <AnimatedBar item style={{flexBasis: interpolate([height], height => `${height}%`), background: 'transparent'}} />
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <Box textAlign="center" mt={3}>
                    <Typography variant="h4" className={classes.lightWhite}>
                        The Manual
                    </Typography>
                </Box>
            </Box>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    return {props: {loggedIn: isAuth}}
}
