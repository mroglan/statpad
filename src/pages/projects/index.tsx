import { GetServerSideProps, GetServerSidePropsContext } from "next";
import getUser from "../../requests/getUser";
import getProjects from '../../requests/getProjects'
import database from '../../database/database'
import SideNav from '../../components/nav/SideNav'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Paper, Button, Box, Typography} from '@material-ui/core'
import Header from '../../components/nav/Header'
import ProjectList from '../../components/lists/ProjectList'
import Link from 'next/link'
import {ObjectId} from 'mongodb'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    sideBar: {
        animation: '$appear 400ms',
        position: 'sticky',
        top: '10%',
        backgroundColor: 'hsl(241, 82%, 60%)',
        [theme.breakpoints.down('sm')]: {
            '& nav': {
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center',
                maxWidth: 600,
                [theme.breakpoints.down('xs')]: {
                    maxWidth: 300
                },
                '& > div': {
                    flexBasis: 300,
                    border: 'none'
                }
            }
        }
    },
    mainContent: {
        animation: '$appear 400ms',
    },
    textWhite: {
        color: '#fff'
    },
    welcomeMessage: {
        color: 'hsl(241, 82%, 90%)',
        textAlign: 'center',
        fontSize: '3rem',
        [theme.breakpoints.down('xs')]: {
            fontSize: '2rem'
        }
    },
    paper: {
        backgroundColor: 'hsl(241, 82%, 50%)',
        position: 'relative',
        marginBottom: '1rem'
    },
    title: {
        fontSize: '2rem',
        color: '#fff',
        textAlign: 'center',
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.5rem'
        }
    },
    '@keyframes appear': {
        '0%': {
            opacity: 0,
            transform: 'scale(0)',
        },
        '100%': {
            opacity: 1,
            transform: 'scale(1)',
        }
    },
    noProjectsContainer: {
        border: '1px dashed ' + theme.palette.success.main,
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 150
    },
    noProjectsTitle: {
        color: '#fff'
    },
    newButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
        margin: theme.spacing(1)
    }
}))

export default function Projects({user, projects}) {

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={true} />
            <Grid container spacing={3}>
                <Grid item md={3} style={{margin: '0 auto'}}>
                    <Paper className={classes.sideBar}>
                        <SideNav />
                    </Paper>
                </Grid>
                <Grid item md={9} xs={12} className={classes.mainContent}>
                    <Box mb={3} px={3}>
                        <Paper className={classes.paper}>
                            <Box>
                                <Typography variant="h3" className={classes.title}>
                                    My Projects
                                </Typography>
                            </Box>
                            <hr style={{marginBottom: 0}} />
                            <Box p={3} className={classes.content}>
                                {projects.length === 0 ? <Box className={classes.noProjectsContainer}>
                                    <Box>
                                        <Typography variant="h6" className={classes.noProjectsTitle}>
                                            Start a Project?
                                        </Typography>
                                        <Box style={{textAlign: 'center'}}>
                                            <Link href="/projects/newproject">
                                                <Button variant="contained" className={classes.newButton}>
                                                    Of Course
                                                </Button>
                                            </Link>
                                        </Box>
                                    </Box>
                                </Box> : <ProjectList projects={projects} />}
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user = await getUser(ctx)
    //console.log(user)
    const projects = await getProjects({'editors': new ObjectId(user._id)})

    return {props: {user, projects: JSON.parse(JSON.stringify(projects))}}
}