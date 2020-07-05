import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import ManualNav from '../../components/nav/ManualNav'
import ManualSideNav from '../../components/nav/ManualSideNav'
import ExampleCarousel from '../../components/carousels/ExampleCarousel1'
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

export default function HypothesisTests({loggedIn, user}) {

    const exampleArray = [
        {
            desc: 'This is the output of a 1 sample hypothesis test for a proportion',
            src: '/hTests/oneSample.png'
        },
        {
            desc: 'This is the output of a 2 sample hypothesis test for proportion',
            src: '/hTests/twoSample.png'
        },
        {
            desc: 'This is the output of a regression hypothesis tests',
            src: '/hTests/regression.png'
        }
    ]

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={loggedIn} />
            <Grid container spacing={3}>
                <Grid item style={{margin: '0 auto'}} md={3}>
                    <Paper className={classes.sideBar}>
                        <ManualSideNav />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box>
                        <ManualNav comp={{name: 'Hypothesis Tests', path: 'hypothesistests'}} />
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Overview
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Create hypothesis tests to see if that population parameter really is what you think it is.
                                The tests available currently are 1/2 sample mean/proportion and regression hypothesis tests.
                                Maybe Chi squared in the future...
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                1 Sample HT
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                You can choose to create a one sample hypothesis test for proportion or mean. If you are
                                creating one for a mean, you can either enter in the statistics neccessary from the sample or
                                select a list to represent the sample data. Then, simply indicate whether you are testing if the 
                                population parameter is less than, greater than, or not equal to the null hypothesis.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                2 Sample HT
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                You can choose to create a two sample hypothesis test for proportion or mean. If you are
                                creating one for a mean, you can either enter in the statistics neccessary for the samples or
                                select the lists to represent the data. Then, simply indicate whether the difference in the population
                                parameters is less than, greater than, or not equal to 0.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Regression HT
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                You can create a regression CI by selecting 2 lists from the data component. The test will
                                generate a linear regression for your sample and will give the probability of the slope being greater than,
                                less than, or not equal to 0.
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
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    const user = isAuth ? await getUser(ctx) : null
    return {props: {loggedIn: isAuth, user}}
}