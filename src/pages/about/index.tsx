import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import Link from 'next/link'
import {useSprings, animated, interpolate} from 'react-spring'
import {useMove, useHover} from 'react-use-gesture'
import {useRef, useEffect} from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import getUser from '../../requests/getUser'
import Head from 'next/head'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    dotContainer: {
       position: 'relative',
       borderRadius: '50%',
       border: '1px solid hsl(241, 82%, 60%)',
       margin: '0 auto',
       background: 'radial-gradient(hsl(241, 82%, 60%), hsl(241, 82%, 43%))',
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        },
        [theme.breakpoints.up('sm')]: {
        width: 300,
        height: 300
        },
        [theme.breakpoints.up('lg')]: {
            width: 400,
            height: 400
        }, 
    },
    dot: {
        position: 'absolute',
        borderRadius: '50%',
        width: '10%',
        height: '10%',
        background: `radial-gradient(hsl(241, 82%, 55%), hsl(241, 82%, 47%))`,
        boxShadow: '.25px .5px 3px 1px hsl(252, 73%, 17%)'
    },
    cardGridItem: {
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto'
        },
        [theme.breakpoints.up('xs')]: {
        height: 300
        },
        [theme.breakpoints.up('lg')]: {
            height: 400
        }, 
    },
    cardImage: {
        height: '50%'
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
    lightWhite: {
        color: theme.palette.primary.light
    },
    spacingTopXS: {
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(4)
        }
    }
}))

export default function About({loggedIn, user}) {

    const AnimatedBox = animated(Box)
    const AnimatedCard = animated(Card)

    const [circles, setCircles] = useSprings<any>(5, i => ({
        from: {
            left: `50%`,
            top: '50%',
            transformX: 'translateX(-50%)',
            transformY: 'translateY(-50%)'
        },
        to: {
            left: `${(i * 20) + 10}%`,
            top: '50%',
            transformX: 'translateX(-50%)',
            transformY: 'translateY(-50%)'
        }
    }))

    const [cards, setCards] = useSprings<any>(4, i => ({
        transform: 'scale(1)',
        from: {
            transform: 'scale(0)'
        }
    }))

    const movementBind = useMove(({xy: [x, y]}) => {

        const addition = (x - 24 < (window.innerWidth - 48) / 2 ? Math.PI : 0) + 
        (x - 24 >= (window.innerWidth - 48) / 2 && y - 64 > (window.innerHeight - 112) / 2 ? 2 * Math.PI : 0)
        const angle = Math.atan(-((y - 64) - ((window.innerHeight - 112) / 2)) / ((x - 24) - ((window.innerWidth - 48) / 2))) + addition
        //console.log(angle * 180 / Math.PI)

        if(isNaN(angle)) return

        setCircles(i => {
            return {
                left: `${50 + (((i * 20) + 10 - 50) * Math.cos(angle))}%`,
                top: `${50 - ((i * 20) + 10 - 50) * Math.sin(angle)}%`,
                transformX: 'translateX(-50%)',
                transformY: 'translateY(-50%)'
            }
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
        <>
        <Head>
            <title>About Statpad</title>
            <meta name="description" content="Learn about Statpad and other random stuff that may have nothing to do with it" />
        </Head>
        <div className={classes.root} {...movementBind()}>
            <Header loggedIn={loggedIn} user={user} />
            <Box pb={3}>
                <Grid container spacing={5} justify="space-between">
                    <Grid item xs={12} sm={7} md={4} className={classes.cardGridItem} >
                        <Link href="/about/resources">
                            <a style={{textDecoration: 'none'}}>
                                <AnimatedCard className={classes.card} style={{transform: cards[0].transform}} {...cardHoverBind(0)} >
                                    <CardMedia className={classes.cardImage} image="/aboutMain/libraries.png" title="Libraries" />
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5" gutterBottom>
                                            Some Resources Used
                                        </Typography>
                                        <Typography variant="body2" className={classes.lightWhite}>
                                            libraries, database, backend, frontend ...
                                        </Typography>
                                    </CardContent>
                                </AnimatedCard>
                            </a>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={7} md={4} className={classes.cardGridItem}>
                        <Link href="/manual">
                            <a style={{textDecoration: 'none'}}>
                                <AnimatedCard className={classes.card} style={{transform: cards[1].transform}} {...cardHoverBind(1)} >
                                    <CardMedia className={classes.cardImage} image="/aboutMain/manual.png" title="The Manual" />
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5" gutterBottom>
                                            The Manual
                                        </Typography>
                                        <Typography variant="body2" className={classes.lightWhite}>
                                            A comprehensive description of your project's functionalities.
                                        </Typography>
                                    </CardContent>
                                </AnimatedCard>
                            </a>
                        </Link>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid item sm={6}>
                        <Box className={classes.dotContainer}>
                            {circles.map((circle, index:number) => (
                                <AnimatedBox key={index} className={classes.dot} 
                                style={{left: circle.left, top: circle.top, transform:
                                interpolate([circle.transformX, circle.transformY], (x, y) => `${x} ${y}`)}} />
                            ))}
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={5} justify="space-between" className={classes.spacingTopXS} >
                    <Grid item xs={12} sm={7} md={4} className={classes.cardGridItem}>
                        <Link href="/about/strangestuff">
                            <a style={{textDecoration: 'none'}}>
                                <AnimatedCard className={classes.card} style={{transform: cards[2].transform}} {...cardHoverBind(2)} >
                                    <CardMedia className={classes.cardImage} image="/aboutMain/errorFunction.png" title="The Math" />
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5" gutterBottom>
                                            Strange Stuff
                                        </Typography>
                                        <Typography variant="body2" className={classes.lightWhite}>
                                            what is happening
                                        </Typography>
                                    </CardContent>
                                </AnimatedCard>
                            </a>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={7} md={4} className={classes.cardGridItem}>
                        <Link href="/about/games">
                            <a style={{textDecoration: 'none'}}>
                                <AnimatedCard className={classes.card} style={{transform: cards[3].transform}} {...cardHoverBind(3)} >
                                    <CardMedia className={classes.cardImage} image="/aboutMain/game.png" title="The Math" />
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5" gutterBottom>
                                            Games
                                        </Typography>
                                        <Typography variant="body2" className={classes.lightWhite}>
                                            Astonishing, absolutely astonishing...
                                        </Typography>
                                    </CardContent>
                                </AnimatedCard>
                            </a>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    const user = isAuth ? await getUser(ctx) : null
    return {props: {loggedIn: isAuth, user}}
}