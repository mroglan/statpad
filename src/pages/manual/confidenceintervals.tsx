import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import ManualNav from '../../components/nav/ManualNav'
import ManualSideNav from '../../components/nav/ManualSideNav'
import ExampleCarousel from '../../components/carousels/ExampleCarousel1'

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

export default function ConfidenceIntervals({loggedIn}) {

    const exampleArray = [
        {
            desc: 'This is the output for a 1 sample confidence interval for a mean',
            src: '/conIntervals/oneSampleResults.png'
        },
        {
            desc: 'This is a graph of a confidence interval either for a mean or a difference of means. The red area of the curve is for values outside the confidence interval',
            src: '/conIntervals/normalCurve.png'
        },
        {
            desc: 'This is the output for a 2 sample confidence interval for the difference of means',
            src: '/conIntervals/twoSampleResults.png'
        }, 
        {
            desc: 'This is the output for a regression confidence interval',
            src: '/conIntervals/regressionResults.png'
        },
        {
            desc: 'This is a graph for a regression confidence interval',
            src: '/conIntervals/regressionGraph.png'
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
                        <ManualNav comp={{name: 'Confidence Intervals', path: 'confidenceintervals'}} />
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Overview
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Create confidence intervals to know how confident you should be about your sample. 
                                The intervals you can create using lists from the data component are 1 sample and 
                                2 sample mean/proportion and regression confidence intervals.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                1 Sample CI
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                You can choose to create a one sample confidence intervals for proportion or mean. If you are
                                creating one for a mean, you can either enter in the statistics neccessary from the sample or
                                select a list to represent the sample data. In addition to returning the confidence interval, you can
                                also choose to display a graph of the interval.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                2 Sample CI
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                You can choose to create a two sample confidence intervals for proportion or mean. If you are
                                creating one for a mean, you can either enter in the statistics neccessary from the sample or
                                select 2 lists to represent the data. Like for 1 sample CI, you can also display a graph in addition
                                to the result.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Regression CI
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                You can create a regression CI by selecting 2 lists from the data component. The test will
                                generate a linear regression for your sample and will give the confidence interval for the slope.
                                Additionally, you can choose to display a graph of the regression.
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
    return {props: {loggedIn: isAuth}}
}