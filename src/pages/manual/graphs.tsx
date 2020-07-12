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

export default function Graphs({loggedIn, user}) {

    const exampleArray = [
        {
            desc: 'This is a scatter plot',
            src: '/graphs/scatter.png'
        },
        {
            desc: 'This is a line chart with 0 tension',
            src: '/graphs/lineChart0Tension.png'
        },
        {
            desc: 'This is a line chart with 0.4 tension (default)',
            src: '/graphs/lineChart04Tension.png'
        },
        {
            desc: 'This is a histogram',
            src: '/graphs/histogram.png'
        },
        {
            desc: 'This is a bar chart',
            src: '/graphs/barChart.png'
        },
        {
            desc: 'This is a pie chart',
            src: '/graphs/pieChart.png'
        },
        {
            desc: 'This is a polar area chart',
            src: '/graphs/polarAreaChart.png'
        },
        {
            desc: "This is a bubble chart (notice how a third dataset is used to determine each bubble's relative size)",
            src: '/graphs/bubbleChart.png'
        },
        {
            desc: 'This is the output for a linear regression',
            src: '/graphs/regressionOutput.png'
        },
        {
            desc: 'This is a linear regression graphed with a scatter plot',
            src: '/graphs/scatterWithRegression.png'
        }
    ]
    
    const classes = useStyles()
    return (
    <>
    <Head>
        <title>Graphs | Statpad Manual</title>
        <link rel="icon" type="image/png" href="https://res.cloudinary.com/dqtpxyaeo/image/upload/v1594509878/webpage/kbe7kwyavz3ye7fxamnl.png" />
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
                    <ManualNav comp={{name: 'Graphs', path: 'graphs'}} />
                </Box>
                <Box>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                            Overview
                        </Typography>
                        <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                            The graph components of your projects are where you can create multiple graphs for your data.
                            A standard graph will allow you to create scatter plots, line charts, bar charts, histograms, 
                            bubble charts, pie charts, and polar area charts. You can even add regressions to your line and scatter plots!
                            Multi graphs will allow you to combine multiple standard graphs on one graph. Finally if you just
                            need some 1 var stats, you can easily generate them.
                        </Typography>
                    </Paper>
                </Box>
                <Box>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                            Graph
                        </Typography>
                        <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                            Each graph gives you the option to display a legend and change the axis lengths and will set the
                            axis labels as the title of the data list you use.
                            The standard graph gives you the multiple chart options to choose from (see overview). 
                            Below you can see some of the features each chart option provides.
                        </Typography>
                        <dl style={{marginTop: 0}}>
                            <dt>
                                <Typography variant="h6" className={`${classes.textWhite} ${classes.subSectionTitle}`}>
                                    Scatter Plot
                                </Typography>
                            </dt>
                            <dd>
                                <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                    For scatter plots, you can change the point color and size.
                                </Typography>
                            </dd>
                            <dt>
                                <Typography variant="h6" className={`${classes.textWhite} ${classes.subSectionTitle}`}>
                                    Line Chart
                                </Typography>
                            </dt>
                            <dd>
                                <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                    Line charts allow you to cusomize points as well as the line's size, color, and tension.
                                </Typography>
                            </dd>
                            <dt>
                                <Typography variant="h6" className={`${classes.textWhite} ${classes.subSectionTitle}`}>
                                    Histogram / Bar Graph
                                </Typography>
                            </dt>
                            <dd>
                                <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                    For both the histogram and bar graph, you can customize the bar background color, border
                                    color, and border width.
                                </Typography>
                            </dd>
                            <dt>
                                <Typography variant="h6" className={`${classes.textWhite} ${classes.subSectionTitle}`}>
                                    Bubble Chart
                                </Typography>
                            </dt>
                            <dd>
                                <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                    The Bubble Chart allows you to customize the point color and the max point radius.
                                </Typography>
                            </dd>
                            <dt>
                                <Typography variant="h6" className={`${classes.textWhite} ${classes.subSectionTitle}`}>
                                    Regression
                                </Typography>
                            </dt>
                            <dd>
                                <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                    You can add a regression to any scatter plot, line chart, or bubble chart that you create.
                                    The available regressions are linear, quadratic, cubic, quartic, natural log, exponential,
                                    and power. You can customize the regression line's color and width (and tension but that will
                                    not do anything...).
                                </Typography>
                            </dd>
                        </dl>
                    </Paper>
                </Box>
                <Box>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                            Multi-Graph
                        </Typography>
                        <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                            The Multi-graph allows you to combine two or more graphs using the same data. Multi-graphs do
                            not currently support regressions but that may change in the future. Note that combining certain graphs 
                            together may lead to unexpected results...
                        </Typography>
                    </Paper>
                </Box>
                <Box>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                            1 Var Stats
                        </Typography>
                        <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                            1 Var Stats will find the mean, median, mode, min, Q1, Q3, max, population standard deviation,
                            and sample standard deviation for any dataset you provide. If you need some 2 var stats, simply 
                            add another 1 var stats and you will likely have all the info you need.
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