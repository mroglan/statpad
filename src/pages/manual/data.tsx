import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import ManualNav from '../../components/nav/ManualNav'
import ManualSideNav from '../../components/nav/ManualSideNav'
import ExampleCarousel from '../../components/carousels/ExampleCarousel'

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
}))

export default function Data({loggedIn}) {

    const examplesArray = [
        {desc: 'This data can be used to create graphs or can be used for confidence intervals, hypothesis tests, and simulations!', src: '/scatterData.png'},
        {desc: 'This data can be used to create graphs or can be used in simulations!', src: '/barData.png'},
        {desc: 'If you need more data for your project, simply add a new column!', src: '/zAxisData.png'}
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
                        <ManualNav comp={{name: 'Data', path: 'data'}} />
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Overview
                            </Typography>
                            <Typography variant="body1" className={`${classes.lightWhite} ${classes.sectionInfo}`}>
                                The Data component of your project contains any data you will be using throughout other components.
                                Each list of data is organized in columns with the title for the list specified in the first row. To
                                add rows or columns, click on the add icons at the bottom and right respectively. To quickly traverse
                                data inputs, either press enter to move to the next cell or press backspace to move back one cell if the cell
                                is empty.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box>
                        <Paper elevation={1} className={classes.paper}>
                            <Typography gutterBottom variant="h4" className={`${classes.textWhite} ${classes.sectionTitle}`}>
                                Examples
                            </Typography>
                            <ExampleCarousel items={examplesArray} />
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