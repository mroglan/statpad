import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import AboutNav from '../../components/nav/AboutNav'
import AboutSideNav from '../../components/nav/AboutSideNav'
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
    }
}))

export default function StrangeStuff({loggedIn, user}) {

    const classes = useStyles()
    return (
        <>
        <Head>
            <title>Strange Stuff | About Statpad</title>
            <link rel="icon" type="image/png" href="https://res.cloudinary.com/dqtpxyaeo/image/upload/v1594509878/webpage/kbe7kwyavz3ye7fxamnl.png" />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            <Grid container spacing={3}>
                <Grid item style={{margin: '0 auto'}} md={3}>
                    <Paper className={classes.sideBar}>
                        <AboutSideNav />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box>
                        <AboutNav comp={{name: 'Strange Stuff', path: 'strangestuff'}} />
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Polynomial Regressions
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                To find the regression equation for a polynomial, you must create a system of equations. To solve
                                these systems of equations it is easiest to express them as matrices. 
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Below is the general formula to creating matrices to solve a polynomial regression.
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/polyMatrixGeneral.png" title="General formula for polynomial regression"
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                In the above picture, each a<sub>k</sub> represents one of the coefficients in your regression. So, if
                                you were making a quadratic regression, you would need to find a<sub>0</sub>, a<sub>1</sub>, and
                                a<sub>2</sub>. 
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Below is the equation you could set up to find a quartic regression.
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/cuarticMatrix.png" title="Equation for quartic regression" 
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Yes, it's as painful as it looks.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Integrating the Normal Curve
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                To find the probability in hypothesis tests, the area of the normal curve from either -Infinity
                                or +Infinity to some z-score is needed. Unfortunately, integrating the normal curve is no easy task.
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Below is the equation for the normal curve.
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/normalCurveEq.png" title="Equation for the normal curve"
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                For the rest of this explanation, I'll be assuming our normal curve has a mean of 0 and a 
                                standard deviation of 1, though this process will work with other values.
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Here is the setup to find the area under the normal curve from 0 to some z-score.
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/normalCurveIntegral.png" title="Integral of the standard normal curve from 0 to z"
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This cannot be integrated algebraically. Instead, we can use something called
                                 the <a href="https://mathworld.wolfram.com/Erf.html" target="_blank" style={{color: 'inherit'}}>Gauss error function</a> (erf).
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/errorFunction.png" title="The Gauss error function"
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                In order to use this error function, we need to employ some u substitution. 
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                u = x / &#8730;(2)
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                u = x / &#8730;(2) --&gt; du/dx = 1 / &#8730;(2) --&gt; dx = &#8730;(2)du
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Now we can rewrite our integral like this:
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/integral1.png" title="U-Substitution"
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Which is the same as...
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/integral2.png" title="Using the error function"
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Now substitute x / &#8730;(2) for u...
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/integral3.png" title="Substituting x back in"
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                But what is the error function? The error function cannot be expressed algebraically, but
                                one way that it can be expressed is with a Taylor series. The Taylor series of the error function
                                is a manipulation of the Taylor series for e<sup>x</sup>.
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This is the maclaurin series for the error function:
                            </Typography>
                            <Grid container justify="center" alignItems="center">
                                <Grid item style={{maxWidth: '96%'}}>
                                    <img src="/strangeStuff/maclaurin.png" title="The Maclaurin series for the error function"
                                    style={{maxWidth: '100%'}} />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This application uses a 21<sup>st</sup> degree Maclaurin polynomial to approximate the probability
                                during a hypothesis test. Unfortunately, because only the maclaurin series is used to approximate the 
                                area, hypothesis tests with |z-scores| greater than 3 will get inaccurate probabilities.
                            </Typography>
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