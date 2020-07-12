import { GetServerSideProps, GetServerSidePropsContext } from "next";
import getUser from "../../../requests/getUser";
import getProjects from '../../../requests/getProjects'
import database from '../../../database/database'
import {ObjectId} from 'mongodb'
import SideNav from '../../../components/nav/SideNav'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Paper, Button, Box, Typography, FormControl, Select, MenuItem, IconButton} from '@material-ui/core'
import Header from '../../../components/nav/Header'
import authenticated from '../../../requests/authenticated'
import VisitProjectList from '../../../components/lists/VisitorProjectList'
import {useState} from 'react'
import SyncIcon from '@material-ui/icons/Sync';
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
    content: {
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 150
    },
    greenButton: {
        color: 'hsl(140, 81%, 31%)',
    },
    spinning: {
        animation: '$rotate 2000ms infinite'
    },
    '@keyframes rotate': {
        '0%': {
            transform: 'rotate(0)'
        },
        '100%': {
            transform: 'rotate(360deg)'
        }
    }
}))

export default function VisitProjects({loggedIn, user, initialProjects}) {

    const [projects, setProjects] = useState(initialProjects)
    const [loading, setLoading] = useState(false)

    const reloadProjects = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.API_ROUTE}/visit/reloadprojects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: user ? user._id : null})
        })

        if(res.status !== 200) return

        const json = await res.json()
        setProjects(json)
        setLoading(false)
    }

    const classes = useStyles() 
    return (
        <>
        <Head>
            <title>Visit Projects | Statpad</title>
            <meta name="description" content="Visit any public Statpad projects you would like!" />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            <Grid container spacing={3}>
                <Grid item md={3} style={{margin: '0 auto'}}>
                    <Paper className={classes.sideBar}>
                        <SideNav />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9} className={classes.mainContent}>
                    <Box mb={3} px={3}>
                        <Paper className={classes.paper}>
                            <Box>
                                <Typography variant="h3" className={classes.title}>
                                    Some Projects
                                </Typography>
                            </Box>
                            <hr style={{marginBottom: 0}} />
                            <Box px={3} pb={3} className={classes.content}>
                                <VisitProjectList projects={projects} />
                            </Box>
                            <div style={{position: 'absolute', left: 0, top: 0}}>
                                <IconButton className={classes.greenButton} aria-label="reload projects" onClick={() => reloadProjects()} >
                                    <SyncIcon className={loading ? classes.spinning : ''} />
                                </IconButton>
                            </div>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    
    try {
        const isAuth = await authenticated(ctx)
        const user:any = isAuth ? await getUser(ctx) : null

        const userId = user ? new ObjectId(user._id) : ''
        //console.log('type of userId', typeof userId)
        const db = await database()
        const projects = await db.collection('projects').aggregate([
            {'$match': {
                'public': true,
                'editors': {
                    '$not': {
                        '$in': [userId]
                    }
                }
            }},
            {'$sample': {
                'size': 5
            }}
        ]).toArray()
        //console.log(projects)

        //JSON.parse(JSON.stringify(projects))
        return {props: {loggedIn: isAuth, user: JSON.parse(JSON.stringify(user)), initialProjects: JSON.parse(JSON.stringify(projects))}}
    } catch(e) {
        console.log(e)
        ctx.res.writeHead(500, {
            Location: `${process.env.BASE_ROUTE}/projects`
        })
        ctx.res.end()
        return {props: {}}
    }
}