import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import Link from 'next/link'
import {useSprings, animated, interpolate} from 'react-spring'
import {useMove} from 'react-use-gesture'
import {useRef, useEffect} from 'react'

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
    }
}))

export default function About({loggedIn}) {

    const AnimatedBox = animated(Box)

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

    const movementBind = useMove(({xy: [x, y]}) => {
        // console.log('x', x - 24)
        // console.log('y', y - 88)
        // compare x - 24 to (window.innerWidth-48)/2
        // compare y - 88 to (window.innerHeight-88)/2

        const addition = (x - 24 < (window.innerWidth - 48) / 2 ? Math.PI : 0) + 
        (x - 24 >= (window.innerWidth - 48) / 2 && y - 88 > (window.innerHeight - 88) / 2 ? 2 * Math.PI : 0)
        const angle = Math.atan(-((y - 88) - ((window.innerHeight - 88) / 2)) / ((x - 24) - ((window.innerWidth - 48) / 2))) + addition
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

    const classes = useStyles()
    return (
        <div className={classes.root} {...movementBind()}>
            <Header loggedIn={loggedIn} />
            <Box>
                <Grid container justify="space-between">
                    <Grid item xs={12} md={3}>
                        Libraries used
                    </Grid>
                    <Grid item xs={12} md={3}>
                        Manual Link
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
                <Grid container justify="space-between">
                    <Grid item xs={12} md={3}>
                        Cool Math
                    </Grid>
                    <Grid item xs={12} md={3}>
                        Reccommended Games
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    return {props: {loggedIn: isAuth}}
}