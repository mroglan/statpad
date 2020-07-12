import { GetServerSideProps, GetServerSidePropsContext } from "next"
import getUser from "../../../../requests/getUser"
import authenticated from '../../../../requests/authenticated'
import {getProjectInfoNoUpdate} from '../../../../requests/getProjectInfo'
import getComponents from '../../../../requests/getComponents'
import {makeStyles} from '@material-ui/core/styles'
import Header from '../../../../components/nav/Header'
import SideNav from '../../../../components/nav/SideNav'
import {Grid, Paper, Box, Typography, Button} from '@material-ui/core'
import checkObjectId from "../../../../utilities/checkObjectId"
import {ObjectId} from 'mongodb'
import BasicProjectInfo from'../../../../components/projectComponents/projectHome/BasicProjectInfo'
import VisitComponentsList from '../../../../components/lists/VisitComponentsList'
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
    mainContent: {
        animation: '$appear 400ms',
    },
    paper: {
        backgroundColor: 'hsl(241, 82%, 50%)',
        position: 'relative',
        marginBottom: '1rem'
    },
    projectTitle: {
        fontSize: '2rem',
        color: '#fff',
        textAlign: 'center',
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.5rem'
        }
    },
    projectContent: {
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 150
    },
}))

export default function VisitProject({loggedIn, user, project, components}) {

    const classes = useStyles()
    return (
        <>
        <Head>
            <title>{project.name} | Visit</title>
            <meta name="description" content={`Visit ${project.name}`} />
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
                    <Paper className={classes.paper}>
                        <Box>
                            <Typography variant="h3" className={classes.projectTitle}>
                                {project.name}
                            </Typography>
                        </Box>
                        <hr style={{marginBottom: 0}} />
                        <BasicProjectInfo editors={project.editorsInfo} isPublic={project.public} />
                        <Box px={3} pb={3} className={classes.projectContent}>
                            <VisitComponentsList components={components} />
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
        if(!checkObjectId(id)) throw 'invalide objectId'

        const [projectInfo, serverComponents] = await Promise.all([ getProjectInfoNoUpdate(id),
        getComponents(new ObjectId(id))])

        if(!projectInfo.public) throw 'not public'

        return {props: {
            project: JSON.parse(JSON.stringify(projectInfo)),
            components: JSON.parse(JSON.stringify(serverComponents)),
            loggedIn: isAuth,
            user
        }}
    } catch(e) {
        console.log(e)
        ctx.res.writeHead(500, {
            Location: `${process.env.BASE_ROUTE}/projects`
        })
        ctx.res.end()
        return {props: {}}
    }
}