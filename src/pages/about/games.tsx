import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import AboutNav from '../../components/nav/AboutNav'
import AboutSideNav from '../../components/nav/AboutSideNav'
import {useSprings, animated} from 'react-spring'
import {useHover} from 'react-use-gesture'
import getUser from '../../requests/getUser'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    lightWhite: {
        color: theme.palette.primary.light
    },
    textWhite: {
        color: '#fff'
    },
    paper: {
        backgroundColor: 'hsl(241, 82%, 45%)',
        position: 'relative',
        marginBottom: '1rem'
    },
    sectionTitle: {
        padding: '1rem 1rem 0 1rem',
    },
    sectionInfo: {
        padding: '0 1rem 1rem 1rem',
        lineHeight: '2rem'
    },
    sideBar: {
        position: 'sticky',
        top: '10%',
        backgroundColor: 'hsl(241, 82%, 60%)', 
        maxHeight: '90vh',
        [theme.breakpoints.down('sm')]: {
            '& nav': {
                display: 'flex',
                flexFlow: 'row wrap',
                maxWidth: 600,
                [theme.breakpoints.down('xs')]: {
                    maxWidth: 300
                },
                '& > div': {
                    flexBasis: 300,
                    border: 'none'
                }
            }
        },
        '&::webkit-scrollbar': {
            display: 'none'
        },
        MsOverflowStyle: 'none'
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
}))

export default function Games({loggedIn, user}) {

    const AnimatedCard = animated(Card)

    const [cards, setCards] = useSprings<any>(4, i => ({
        transform: 'scale(1)',
        from: {
            transform: 'scale(0)'
        }
    }))

    const cardHoverBind = useHover(({args: [index], active}) => {

        setCards((i:number) => {
            if(i !== index) return
            return {transform: active ? 'scale(1.08)' : 'scale(1)', height: '100%'}
        })
    })

    const links = ['https://mroglan.github.io/game/defense.html', 'https://mroglan.github.io/penalty/',
        'https://mroglan.github.io/lasergame/index.html', 'https://mroglan.github.io/flapp/flappyBird.html']

    const images = ['/games/btdbb.png', '/games/penalty.png', '/aboutMain/game.png', '/games/flappy.png']

    const cardTitles = ['BTDBB', 'Penalty Shootout', 'Space Destroyer', 'Flappy Bird']

    const cardDesc = [
        'Face wave after wave of ferocious barbarians in an attempt to not die a painful death. Explore new terrians, unlock new troops, and conquer new adversaries to become champion of BTDBB!',
        'Compete against a nearby foe in an epic 1 v 1 penalty shootout. Will you champion against all odds or succumb to defeat in the most important event of your lifetime?',
        'Lead your crew during a series of intense battles only matched by those in Star Wars. Will you survive 12 rounds, facing stronger and more powerful foes each wave? Few have found success, but those which do will never be forgotten.',
        'Play one of the most iconic single player games of all time in an easy to use html environment. Lead your bird through a series of increasingly challenging pipes to earn a score matched by none.'
    ]

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            <Grid container spacing={3}>
                <Grid item style={{margin: '0 auto'}} md={3}>
                    <Paper className={classes.sideBar}>
                        <AboutSideNav />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box mb={3}>
                        <AboutNav comp={{name: 'Games', path: 'games'}} />
                    </Box>
                    <Grid container spacing={3} alignItems="stretch">
                        {cards.map((card, index:number) => (
                            <Grid key={index} item xs={12} sm={6}>
                                <a style={{textDecoration: 'none'}} href={links[index]}>
                                    <AnimatedCard className={classes.card} style={{transform: card.transform}} {...cardHoverBind(index)} >
                                        <CardMedia className={classes.cardImage} image={images[index]} title="Card Image" />
                                        <CardContent className={classes.cardContent}>
                                            <Typography variant="h5" gutterBottom>
                                                {cardTitles[index]}
                                            </Typography>
                                            <Typography variant="body2" className={classes.lightWhite}>
                                                {cardDesc[index]}
                                            </Typography>
                                        </CardContent>
                                    </AnimatedCard>
                                </a>
                            </Grid>
                        ))}
                    </Grid>
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