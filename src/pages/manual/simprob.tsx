import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import ManualNav from '../../components/nav/ManualNav'
import ManualSideNav from '../../components/nav/ManualSideNav'
import ExampleCarousel from '../../components/carousels/ExampleCarousel1'
import getUser from '../../requests/getUser'
import Head from 'next/head'

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
    subSectionTitle: {
        padding: '0 1rem'
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
}))

export default function SimProb({loggedIn, user}) {

    const exampleArray = [
        {
            desc: 'This is a 2 way table', 
            src: '/simProb/twoWayTable.png'
        },
        {
            desc: 'This is a tree diagram',
            src: '/simProb/treeDiagram.png'
        },
        {
            desc: 'This is a table containing the outcome for each trial in the simulation',
            src: '/simProb/simulationTable.png'
        }, 
        {
            desc: 'This is a graph showing the frequency of each outcome in the simulation',
            src: '/simProb/simulationGraph.png'
        },
        {
            desc: 'These are the results from a binomial probability',
            src: '/simProb/binomialResults.png'
        },
        {
            desc: 'This is a graph displaying the binomial distribution',
            src: '/simProb/binomialGraph.png'
        },
        {
            desc: 'These are the results from a geometric probability',
            src: '/simProb/geometricResults.png'
        },
        {
            desc: 'This is a graph displaying the geometric distribution',
            src: '/simProb/geometricGraph.png'
        }
    ]

    const classes = useStyles()
    return (
        <>
        <Head>
            <title>Simulations &amp; Probability | Statpad Manual</title>
            <meta name="description" content="Explore Simulations &amp; Probability in Statpad: tree diagrams, 2 way tables, simulations, and much more!" />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            <Grid container spacing={3}>
                <Grid item style={{margin: '0 auto'}} md={3}>
                    <Paper className={classes.sideBar}>
                        <ManualSideNav />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box>
                        <ManualNav comp={{name: 'Simulations & Probability', path: 'simprob'}} />
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Overview
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Find the probability you need and display it using one of this component's features. You can 
                                create tree diagrams, create two way tables, run simulations, find binomial probability, or find
                                geometric probability. For the majority of the features, you will not use data from the data component
                                of your project. 
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Tree Diagram
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                The tree diagram allows you to visualize a series of independent events, each branch representing
                                a possible outcome with some probability. There is no limit to how many branches your diagram contains.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Two Way Table
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                The two way table can be used to illustrate conditional and relative probability of some event.
                                You can choose whether the table displays totals for each row and column, and whether the table displays
                                the frequency or relative probability of each input. Add as many rows and columns as you need!
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Simulation
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                The simulation feature will simulate a given number of trials, returning an output from a
                                given number of inputs for each trial. Inputs can either be a range or a given list of inputs 
                                from the data component of your project. A table will display the results from each trial
                                and you can optionally display a graph showing the frequency of each outcome.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Binomial Probability
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Simply input the number of trials, probability of success, and the number of successes
                                and a probability will be calculated. You can also choose to use binomcdf to calculate the cumulative
                                probability for a number of successful trials. You can optionally display a graph showing the binomial distribution.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Geometric Probability
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Simply input the number of trials, probability of success, and the trial of the first success
                                and a probability will be calculated. You can also choose to use geometcdf to calculate the cumulative
                                probability for a successful trial. You can optionally display a graph showing the geometric distribution.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Examples
                            </Typography>
                            <ExampleCarousel items={exampleArray} />
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    const user = isAuth ? await getUser(ctx) : null
    return {props: {loggedIn: isAuth, user}}
}