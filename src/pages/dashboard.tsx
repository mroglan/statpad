import router from 'next/router'
import { GetServerSideProps, NextPageContext, GetServerSidePropsContext } from 'next'
import database from '../database/database'
import getUser from '../requests/getUser'
import Header from '../components/nav/Header'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Paper, Button, Box, Typography} from '@material-ui/core'
import SideNav from '../components/nav/SideNav'
import MenuIcon from '@material-ui/icons/Menu';
import {useRef} from 'react'
import Link from 'next/link'
import ProjectList from '../components/lists/ProjectList'
import {ObjectId} from 'mongodb'
import Head from 'next/head'

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
    recents: {
        backgroundColor: 'hsl(241, 82%, 50%)',
        position: 'relative',
        marginBottom: '1rem'
    },
    recentsTitle: {
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
    recentsContent: {
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

export default function Dashboard({user, recentProjects}) {

    const classes = useStyles()
    return (
        <>
        <Head>
            <title>Dashboard | Statpad</title>
            <meta name="description" content="View any recent projects you have been working on" />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={true} user={user} />
            <Grid container spacing={3}>
                <Grid item md={3} style={{margin: '0 auto'}}>
                    <Paper className={classes.sideBar}>
                        <SideNav />
                    </Paper>
                </Grid>
                <Grid item className={classes.mainContent} md={9} xs={12}>
                    <Box mb={3}>
                        <Typography variant="h1" className={classes.welcomeMessage}>
                            Welcome, {user.username}
                        </Typography>
                    </Box>
                    <Box my={3} px={3}>
                        <Paper className={classes.recents}>
                            <Box>
                                <Typography variant="h3" className={classes.recentsTitle}>
                                    Recent Projects
                                </Typography>
                            </Box>
                            <hr style={{marginBottom: 0}} />
                            <Box p={3} className={classes.recentsContent}>
                                {recentProjects.length === 0 ? <Box className={classes.noProjectsContainer}>
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
                                </Box> : <ProjectList editable={false} projects={recentProjects} />}
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user:any = await getUser(ctx)
    if(!user) return {props: {}}
    const db = await database()
    const recentProjectsFound = await db.collection('projects').find({'editors': new ObjectId(user._id)}).sort({updateDate: -1}).limit(5).toArray()
    const recentProjects = recentProjectsFound.map(doc => {
        const editors = doc.editors.map(editor => editor.toString())
        return {...doc, _id: doc._id.toString(), owner: doc.owner.toString(), createDate: doc.createDate.toString(), updateDate: doc.updateDate.toString(), editors}
    })
    console.log(recentProjects)
    return {props: {user, recentProjects}}
}