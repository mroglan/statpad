import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import AboutNav from '../../components/nav/AboutNav'
import AboutSideNav from '../../components/nav/AboutSideNav'
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
    link: {
        color: 'inherit',
        textDecorationColor: 'inherit'
    }
}))

export default function Libraries({loggedIn, user}) {

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
                    <Box>
                        <AboutNav comp={{name: 'Libraries', path: 'libraries'}} />
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/bcrypt">
                                    Bcrypt
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library is used to hash passwords before storing them in the database, and it is then
                                used to validate a user's password when logging in.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/chart.js?activeTab=readme">
                                    Chartjs
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library is used to create the graphs throughout the application. It provides support for
                                scatter plots, line charts, bar graphs, pie charts, polar area charts, and pie charts. All equations (and 
                                normal curves) graphed are just really large scatter plots. 
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/cookie">
                                    Cookie
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library allows you to set and read cookies. This application uses cookies to store a 
                                user's JWT which is used for authorization. The package also allows you to specify options like
                                https only or same site only. 
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/formik">
                                    Formik
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library is used to validate and display errors for forms in the login and signup pages.
                                For validation client side, another library called Yup is used.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/jsonwebtoken">
                                    Jsonwebtoken
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library can be used to create and verify JSON web tokens (JWT). A JWT is created when 
                                the user logs in with an expiration date of 48 hours, and each time the user makes a request
                                to an authenticated route, the JWT is verified.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/@material-ui/core">
                                    Material-UI
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Material UI is used to make styling React user interfaces simpler by taking advantage of 
                                pre-built components meant to replicate Google's Material Design.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/mongodb">
                                    Mongodb
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library is used to communicate with the Mongodb database this application uses. 
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/next">
                                    Next
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                Nextjs is a powerful framework that can be used to create React applications. It allows for 
                                server side rendering and static site generation, and it can make deploying a react app into 
                                production easier.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/nprogress">
                                    Nprogress
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library is used to display a loading bar at the top of the page every time the user navigates
                                to a new page. Because this site uses server side rendering, it usually takes a few seconds for the 
                                new page to receive the server side props, so nprogress gives the user an indication the page is loading.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/react">
                                    React
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                React is a popular library used to create user interfaces for applications. By incorporating 
                                Nextjs with this library, I am able to build a user interface with react while also 
                                improving my SEO. 
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/react-spring">
                                    React-Spring
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library is used to create the animations in the about and manual page. It has good performance
                                and allows me to animate elements without having to re-render the component when an animation is triggered.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/react-use-gesture">
                                    React-Use-Gesture
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library is used to complement react-spring and make detecting a "gesture" from a user easier.
                                When a specific gesture is detected, I can then use react-spring to create an animation. This project uses
                                the mouse move and hover gestures, but use-gesture also supports dragging, pinching, scrolling, and much more.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                <a className={classes.link} target="_blank" href="https://www.npmjs.com/package/yup">
                                    Yup
                                </a>
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                This library is used for parsing and validating user inputs. In this application it is used in the login 
                                and signup pages to validate user inputs on the client side.
                            </Typography>
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