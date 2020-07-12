import { GetServerSideProps, NextPageContext, GetServerSidePropsContext } from 'next'
import database from '../../../database/database'
import getUser from '../../../requests/getUser'
import authenticated from '../../../requests/authenticated'
import checkObjectId from '../../../utilities/checkObjectId'
import {ObjectId} from 'mongodb'
import Header from '../../../components/nav/Header'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Paper, Button, Box, Typography, TextField, FormControl, OutlinedInput, CircularProgress,
    Snackbar, IconButton, Tooltip, Avatar} from '@material-ui/core'
import {useState} from 'react'
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import Link from 'next/link'
import VisitorProjectList from '../../../components/lists/VisitorProjectList'
import Head from 'next/head'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    imgContainer: {
        borderRadius: '50%',
        width: 300,
        height: 300,
        [theme.breakpoints.down('sm')]: {
            width: 200,
            height: 200
        },
        overflow: 'hidden',
        border: '1px solid hsl(241, 82%, 45%)',
        margin: '0 auto',
        backgroundColor: 'hsl(241, 82%, 47%)',
    }, 
    profileImg: {
        objectFit: 'cover',
        width: '100%',
        height: 300,
        [theme.breakpoints.down('sm')]: {
            height: 200
        },
    },
    blankImg: {
        width: '100%',
        height: '100%'
    },
    paper: {
        backgroundColor: 'hsl(241, 82%, 47%)',
        padding: '1rem 0'
    },
    textWhite: {
        color: '#fff'
    },
    profileName: {
        color: '#fff',
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.5rem'
        }
    },
    dropDownBtn: {
        paddingLeft: 0,
        color: '#fff',
        '&:hover': {
            backgroundColor: 'initial'
        }
    },
}))

export default function ViewProfile({publicProjects, editors, loggedIn, user, profile}) {

    const [displayEditors, setDisplayEditors] = useState(false)
    const [displayProjects, setDisplayProjects] = useState(false)
    
    const classes = useStyles()
    return (
        <>
        <Head>
            <title>{profile.username} | Statpad</title>
            <link rel="icon" type="image/png" href="https://res.cloudinary.com/dqtpxyaeo/image/upload/v1594509878/webpage/kbe7kwyavz3ye7fxamnl.png" />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={5} style={{margin: '0 auto', position: 'relative'}}>
                    <Paper elevation={2} className={classes.imgContainer}>
                        <Grid container style={{height: '100%'}}>
                            <img className={profile.image ? classes.profileImg : classes.blankImg} src={profile.image || '/users/blankProfile.png'} />
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={7}>
                    <Paper className={classes.paper}>
                        <Box my={2} px={3}>
                            <Typography variant="h2" className={classes.profileName}>
                                {profile.username}
                            </Typography>
                        </Box>
                        <hr className={classes.textWhite} />
                        <Box my={2} px={3}>
                            <Typography variant="h4" className={classes.textWhite}>
                                {editors.length} co-editors <IconButton className={classes.dropDownBtn}
                                disableFocusRipple disableRipple onClick={() => setDisplayEditors(!displayEditors)}>
                                    <UnfoldMoreIcon />
                                </IconButton>
                            </Typography>
                            {displayEditors && <Grid container spacing={3}>
                            {editors.map((editor, index) => (
                                <Grid item key={index}>
                                    <Link href="/profile/[id]" as={`/profile/${editor._id}`}>
                                        <a>
                                            <Tooltip title={editor.username}>
                                                <Avatar alt={editor.username} src={editor.image || '/users/blankProfile.png'} />
                                            </Tooltip>
                                        </a>
                                    </Link>
                                </Grid>
                            ))}
                            </Grid>}
                        </Box>
                        <Box my={2} px={3}>
                            <Typography variant="h4" className={classes.textWhite}>
                                {publicProjects.length} public projects <IconButton className={classes.dropDownBtn}
                                disableFocusRipple disableRipple onClick={() => setDisplayProjects(!displayProjects)}>
                                    <UnfoldMoreIcon />
                                </IconButton>
                            </Typography>
                            {displayProjects && <VisitorProjectList projects={publicProjects} />}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    try {
        const isAuth = await authenticated(ctx)
        const user = isAuth ? await getUser(ctx) : null
        const id = Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id
        if(!checkObjectId(id)) throw 'invalid objectid'

        const db = await database()
        const [projects, profile] = await Promise.all([db.collection('projects').aggregate([
            {'$match': {
                'editors': new ObjectId(id)
            }}, {'$lookup': {
                'from': 'users',
                'localField': 'editors',
                'foreignField': '_id',
                'as': 'editorsInfo'
            }}
        ]).toArray(), db.collection('users').findOne({'_id': new ObjectId(id)})])

        //console.log(projects)

        const allProjEditors:any[] = projects.reduce((editors, project) => {
            return [...editors, ...project.editorsInfo]
        }, []).filter(editor => editor._id.toString() !== profile._id.toString())
        const editors = [...Array.from(new Set(allProjEditors))]
        
        const publicProjects = projects.filter(proj => proj.public)

        return {props: {publicProjects: JSON.parse(JSON.stringify(publicProjects)), editors: JSON.parse(JSON.stringify(editors)), 
            loggedIn: isAuth, user, profile: JSON.parse(JSON.stringify(profile))}}
    } catch(e) {
        console.log(e)
        ctx.res.writeHead(500, {
            Location: `${process.env.BASE_ROUTE}/profile`
        })
        ctx.res.end()
        return {props: {}}
    }
}