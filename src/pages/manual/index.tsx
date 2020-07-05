import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import {useMove, useHover} from 'react-use-gesture'
import {useSprings, animated, interpolate} from 'react-spring'
import Link from 'next/link'
import {Fragment} from 'react'
import getUser from '../../requests/getUser'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    bar: {
        backgroundColor: 'transparent', //'hsl(241, 82%, 85%)',
        flexBasis: '19%',
        // borderLeft: '2.5px solid hsl(241, 82%, 43%)',
        // borderRight: '2.5px solid hsl(241, 82%, 43%)'
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
    },
    cardImage: {
        minHeight: 100,
        [theme.breakpoints.up('sm')]: {
            minHeight: 200
        }
    },
    cardContent: {
        backgroundImage: 'linear-gradient(0deg, hsl(241, 82%, 60%), hsl(241, 82%, 43%))', //'hsl(241, 82%, 60%)',
        color: '#fff',
        flexGrow: 1
    },
    card: {
        height: '100%',
        display: 'flex', 
        flexDirection: 'column'
    },
    cardGridItem: {
        flex: '0 0 305px',
        maxWidth: 400
    },
    barSeperator: {
        flexBasis: '.5%',
        background: 'hsl(241, 82%, 43%)'
    }
}))

const toHeight = (index:number) => ({height: 20 * index})

export default function Manual({loggedIn, user}) {

    const AnimatedBar = animated(Grid)
    const AnimatedCard = animated(Card)

    const [bars, setBars] = useSprings<any>(5, i => ({...toHeight(i), from: {height: 0}}))
    const [cards, setCards] = useSprings<any>(5, i => ({transform: 'scale(1)', from: {transform: 'scale(0)'}}))

    const horzMovementBind = useMove(({xy: [x]}) => {
        // compare window.innerWidth - 48 to x - 24

        const mousePercent = (x - 24) / (window.innerWidth - 48)

        setBars((i:number) => {
            const percentDifference = 100 - (Math.abs(mousePercent - ((i + .5) / 5)) * 100)
            return {height: percentDifference}
        })
    })

    const cardHoverBind = useHover(({args: [index], active}) => {

        setCards((i:number) => {
            if(i !== index) return
            return {transform: active ? 'scale(1.08)' : 'scale(1)', height: '100%'}
        })
    })

    const classes = useStyles()
    return (
        <div className={classes.root} {...horzMovementBind()}>
            <Header loggedIn={loggedIn} user={user} />
            <Box>
                <Grid container direction="row" wrap="nowrap" alignItems="flex-end" justify="space-around"
                className={classes.barsContainer} style={{margin: '0 auto'}}>
                    {bars.map(({height}, index:number) => (<Fragment key={index}>
                        <Grid item className={classes.barSeperator} style={{height: '100%'}}>
                            <Grid container></Grid>
                        </Grid>
                        <Grid item className={classes.bar} style={{height: '100%'}}>
                            <Grid container direction="column" style={{height: '100%'}}>
                                <Grid item style={{flexGrow: 1, flexBasis: 0, backgroundColor: 'hsl(241, 82%, 43%)'}} />
                                <AnimatedBar item style={{flexBasis: interpolate([height], height => `${height}%`), background: 'transparent'}} />
                            </Grid>
                        </Grid>
                        <Grid item className={classes.barSeperator} style={{height: '100%'}}>
                            <Grid container></Grid>
                        </Grid>
                    </Fragment>))}
                </Grid>
                <Box textAlign="center" my={3}>
                    <Typography variant="h4" className={classes.lightWhite}>
                        Select a Component
                    </Typography>
                </Box>
            </Box>
            <Grid container spacing={5} justify="center" alignItems="stretch">
                <Grid item className={classes.cardGridItem} >
                    <Link href="/manual/data">
                        <a style={{textDecoration: 'none'}}>
                            <AnimatedCard className={classes.card} style={{transform: cards[0].transform}} {...cardHoverBind(0)} >
                                <CardMedia className={classes.cardImage} image="/data.png" title="Data Table" />
                                <CardContent className={classes.cardContent}>
                                    <Typography variant="h5" gutterBottom>
                                        Data
                                    </Typography>
                                    <Typography variant="body2" className={classes.lightWhite}>
                                        Input data that will be used throughout your project
                                    </Typography>
                                </CardContent>
                            </AnimatedCard>
                        </a>
                    </Link>
                </Grid>
                <Grid item className={classes.cardGridItem}>
                    <Link href="/manual/graphs">
                        <a style={{textDecoration: 'none'}}>
                            <AnimatedCard className={classes.card} style={{transform: cards[1].transform}} {...cardHoverBind(1)}>
                                <CardMedia className={classes.cardImage} image="/graph.png" title="Graph" />
                                <CardContent className={classes.cardContent}>
                                    <Typography variant="h5" gutterBottom>
                                        Graphs
                                    </Typography>
                                    <Typography variant="body2" className={classes.lightWhite}>
                                        Create unique graphs for your data
                                    </Typography>
                                </CardContent>
                            </AnimatedCard>
                        </a>
                    </Link>
                </Grid>
                <Grid item className={classes.cardGridItem}>
                    <Link href="/manual/simprob">
                        <a style={{textDecoration: 'none'}}>
                            <AnimatedCard className={classes.card} style={{transform: cards[2].transform}} {...cardHoverBind(2)}>
                                <CardMedia className={classes.cardImage} image="/prob.png" title="Geometric Probability" />
                                <CardContent className={classes.cardContent}>
                                    <Typography variant="h5" gutterBottom>
                                        Simulations and Probability
                                    </Typography>
                                    <Typography variant="body2" className={classes.lightWhite}>
                                        Run simulations and find the probability you need
                                    </Typography>
                                </CardContent>
                            </AnimatedCard>
                        </a>
                    </Link>
                </Grid>
                <Grid item className={classes.cardGridItem}>
                    <Link href="/manual/confidenceintervals">
                        <a style={{textDecoration: 'none'}}>
                            <AnimatedCard className={classes.card} style={{transform: cards[3].transform}} {...cardHoverBind(3)}>
                                <CardMedia className={classes.cardImage} image="/conInterval.png" title="Confidence Interval" />
                                <CardContent className={classes.cardContent}>
                                    <Typography variant="h5" gutterBottom>
                                        Confidence Intervals
                                    </Typography>
                                    <Typography variant="body2" className={classes.lightWhite}>
                                        Create confidence intervals to give you confidence
                                    </Typography>
                                </CardContent>
                            </AnimatedCard>
                        </a>
                    </Link>
                </Grid> 
                <Grid item className={classes.cardGridItem}>
                    <Link href="/manual/hypothesistests">
                        <a style={{textDecoration: 'none'}}>
                            <AnimatedCard className={classes.card} style={{transform: cards[4].transform}} {...cardHoverBind(4)}>
                                <CardMedia className={classes.cardImage} image="/htest.png" title="Hypothesis Test" />
                                <CardContent className={classes.cardContent}>
                                    <Typography variant="h5" gutterBottom>
                                        Hypothesis Tests
                                    </Typography>
                                    <Typography variant="body2" className={classes.lightWhite}>
                                        Compute a variaty of different tests using sample stats or your data
                                    </Typography>
                                </CardContent>
                            </AnimatedCard>
                        </a>
                    </Link>
                </Grid>
            </Grid>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    const user = isAuth ? await getUser(ctx) : null
    return {props: {loggedIn: isAuth, user}}
}
