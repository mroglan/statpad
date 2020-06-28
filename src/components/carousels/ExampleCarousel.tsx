import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {useSprings, animated} from 'react-spring'
import {useRef} from 'react'

const useStyles = makeStyles(theme => ({
    picBox: {
        position: 'relative',
        height: 200,
        overflow: 'hidden',
        [theme.breakpoints.up('sm')]: {
            height: 300
        },
        [theme.breakpoints.up('lg')]: {
            height: 400
        },
    },
    lightWhite: {
        color: theme.palette.primary.light
    },
    picGridItem: {
        width: '100%',
        textAlign: 'center',
        maxHeight: 200,
        [theme.breakpoints.up('sm')]: {
            maxHeight: 300
        },
        [theme.breakpoints.up('lg')]: {
            maxHeight: 400
        },
        '& img': {
            maxWidth: '100%',
            maxHeight: 200,
            [theme.breakpoints.up('sm')]: {
                maxHeight: 300
            },
            [theme.breakpoints.up('lg')]: {
                maxHeight: 400
            }
        }
    }
}))

export default function ExampleCarousel({items}) {

    const AnimatedGrid = animated(Grid)
    const AnimatedTypography = animated(Typography)

    const [examples, setExamples] = useSprings<any>(items.length, i => ({
        from: {
            transform: 'scale(0)'
        },
        transform: i === 0 ? 'scale(1)' : 'scale(0)',
        position: i === 0 ? 'initial' : 'absolute'
    }))

    const currentEx = useRef<number>()
    currentEx.current = 0

    const newExample = (dir:string) => {
        setExamples((i:number) => {
            if(i === currentEx.current) {
                return {transform: `scale(0)`, position: 'absolute'}
            } else if(dir === 'next' && i === currentEx.current + 1) {
                return {transform: 'scale(1)', position: 'initial'}
            } else if(dir === 'next' && currentEx.current + 1 === items.length && i === 0) {
                return {transform: 'scale(1)', position: 'initial'}
            } else if(dir === 'prev' && i === currentEx.current - 1) {
                return {transform: 'scale(1)', position: 'initial'}
            } else if(dir === 'prev' && currentEx.current - 1 < 0 && i === items.length - 1) {
                return {transform: 'scale(1)', position: 'initial'}
            }
        })
        if(dir === 'next') currentEx.current = currentEx.current + 1 < items.length ? currentEx.current + 1 : 0
        else currentEx.current = currentEx.current - 1 < 0 ? items.length - 1 : currentEx.current - 1
    }

    const classes = useStyles()
    return (
        <Box>
            <Grid container justify="center" alignItems="center" className={classes.picBox}>
                <Grid item className={classes.picGridItem}>
                    {examples.map((example, index) => {
                        return <animated.img key={index} src={items[index].src} style={{...example}} />
                    })}
                </Grid>
            </Grid>
            <Grid container spacing={3} direction="row" wrap="nowrap" style={{marginTop: '.5rem'}} >
                <Grid item>
                    <IconButton className={classes.lightWhite} onClick={(e) => newExample('prev')} >
                        <ArrowBackIosIcon />
                    </IconButton>
                </Grid>
                <Grid item style={{flexGrow: 1, display: 'flex', alignItems: 'center', position: 'relative'}}>
                    {examples.map((example, index) => (
                        <AnimatedTypography key={index} style={{...example}} variant="body1" className={classes.lightWhite}>
                            {items[index].desc}
                        </AnimatedTypography>
                    ))}
                </Grid>
                <Grid item>
                    <IconButton className={classes.lightWhite} onClick={(e) => newExample('next')} >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    )
}