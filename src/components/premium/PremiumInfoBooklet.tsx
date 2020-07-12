import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, Button} from '@material-ui/core'
import {useSpring, animated, interpolate} from 'react-spring'
import {useDrag} from 'react-use-gesture'
import {useRef, useState} from 'react'
import Link from 'next/link'

const useStyles = makeStyles(theme => ({
    root: {
        margin: '0 auto',
        width: 200,
        height: 220,
        border: '1px solid #fff',
        [theme.breakpoints.up('sm')]: {
            width: 400,
            height: 440
        },
        [theme.breakpoints.up('lg')]: {
            width: 600,
            height: 660
        }
    },
    container: {
        width: '100%',
        height: '100%',
        background: '#2e517d',
        float: 'right',
        position: 'relative',
        perspective: 1000
    },
    cover: {
        height: '100%',
        position: 'absolute',
        left: '16%',
        background: 'url(/premium/bookCover.png)',
        transformStyle: 'preserve-3d',
        transformOrigin: 'left',
        backgroundSize: 'cover'
    },
    spine: {
        height: '100%',
        position: 'absolute',
        width: '16%',
        //background: 'url(https://c8.alamy.com/comp/C3EG95/spine-of-an-antique-leather-bound-book-holy-court-end-on-with-dark-C3EG95.jpg)',
        backgroundSize: 'cover',
        background: 'url(/premium/bookSpine.png)'
    },
    title: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    titleText: {
        color: '#fff',
        textShadow: '5px 5px 6px #D4AD10'
    },
    subTitle: {
        position: 'absolute',
        left: '50%',
        top: '100%',
        transform: 'translateX(-50%) translateY(-100%)'
    },
    subTitleText: {
        color: '#C6C3B7',
        textShadow: '2px 2px 3px #000',
        whiteSpace: 'nowrap' 
    },
    textContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
        zIndex: -1,
        margin: theme.spacing(1)
    },
    text: {
        color: theme.palette.success.main
    }
}))

export default function PremiumInfoBooklet() {

    const AnimatedBox = animated(Box)

    const [flipped, setFlipped] = useState(false)

    const containerRef = useRef<HTMLDivElement>()

    const [cover, setCover]:any = useSpring<any>(() => ({
        rotate: 0,
        width: '84%'
    }))

    const dragBind = useDrag(({active, movement: [xDir], cancel}) => {
        // console.log('active', active)
        // console.log('movement', xDir)
        //console.log(containerRef.current.clientWidth)

        if(flipped) return

        if(xDir > 0) {
            console.log('xDir greater than 0')
            setCover({rotate: 0})
            return
        }

        if(!active) {
            console.log('not active anymore')
            setCover({rotate: 0})
            return
        }

        const rotation = 180 * xDir / containerRef.current.clientWidth
        const size = 84 * (1 - (-xDir / containerRef.current.clientWidth))

        if(Math.abs(rotation) > 80) {
            setCover({rotate: -100, width: '0px'})
            cancel()
            setFlipped(true)
            return
        }   

        console.log('transforming cover...')
        setCover({rotate: rotation, width: `${size}%`})
    })

    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <Box className={classes.container} {...dragBind()}>
                <div ref={containerRef} style={{width: '100%'}}>
                    <Box className={classes.spine} style={{opacity: flipped ? 0 : 1}}>

                    </Box>
                    <animated.div className={classes.cover} style={{transform: interpolate([cover.rotate], rot => {
                        console.log('rot', rot)
                        return `rotateY(${rot}deg)`
                    }), width: cover.width}}>
                        {!flipped && <><Box className={classes.title} textAlign="center">
                            <Typography variant="h2" className={classes.titleText}>
                                PREMIUM
                            </Typography>
                        </Box>
                        <Box className={classes.subTitle} textAlign="center">
                            <Typography variant="h4" className={classes.subTitleText}>
                                Swipe open
                            </Typography>
                        </Box></>}
                    </animated.div>
                </div>
                <Box className={classes.textContainer}>
                    <Box textAlign="center">
                        <Typography variant="h4" className={classes.text}>
                            Unlock Absolutely Nothing!
                        </Typography>
                    </Box>
                    <Box>
                        <Link href="/premium/checkout">
                            <a style={{textDecoration: 'none'}}>
                                <Button variant="contained" className={classes.button}>
                                    Purchase for $4.99
                                </Button>
                            </a>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}