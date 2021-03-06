import { GetServerSideProps, GetServerSidePropsContext } from "next"
import getUser from "../../../requests/getUser"
import getProjectInfo from '../../../requests/getProjectInfo'
import getComponents from '../../../requests/getComponents'
import {makeStyles} from '@material-ui/core/styles'
import Header from '../../../components/nav/Header'
import SideNav from '../../../components/nav/SideNav'
import {Grid, Paper, Box, Typography, Button} from '@material-ui/core'
import ComponentsList from "../../../components/lists/ComponentsList"
import NewComponentDialog from '../../../components/dialogs/newComponentDialog'
import DeleteComponentDialog from '../../../components/dialogs/deleteComponentDialog'
import InviteEditorDialog from '../../../components/dialogs/inviteEditorDialog'
import RemoveEditorDialog from '../../../components/dialogs/removeEditorDialog'
import Link from 'next/link'
import {useState} from 'react'
import {ObjectId} from 'mongodb'
import verifyEditor from '../../../requests/verifyEditor'
import checkObjectId from '../../../utilities/checkObjectId'
import BasicProjectInfo from'../../../components/projectComponents/projectHome/BasicProjectInfo'
import {User, BaseComponent} from '../../../components/projectComponents/projectInterfaces'
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
    noComponentsContainer: {
        border: '1px dashed ' + theme.palette.success.main,
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noComponentsTitle: {
        color: '#fff'
    },
    newButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
        margin: theme.spacing(1)
    },
    deleteButton: {
        backgroundColor: 'hsla(348, 91%, 40%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(348, 91%, 40%, .9)'
        },
        margin: theme.spacing(1)
    },
    inviteButton: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)'
        },
        margin: theme.spacing(1)
    }
}))

interface Props {
    user: User;
    project: any;
    serverComponents: BaseComponent[];
}

export default function Project({user, project, serverComponents}:Props) {

    const [openModal, setOpenModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [openAddEditorModal, setOpenAddEditorModal] = useState(false)
    const [openRemoveEditorModal, setOpenRemoveEditorModal] = useState(false)
    const [components, setComponents] = useState(serverComponents)
    const [editors, setEditors] = useState(project.editorsInfo)

    const toggleNewComponentModal = (newComponent) => {
        setOpenModal(!openModal)
        if(!newComponent) return
        //console.log(newComponent)
        const compCopy = [...components]
        compCopy.unshift(newComponent)
        setComponents(compCopy)
    }

    const toggleRemoveComponentModal = (remainingComponents) => {
        setDeleteModal(!deleteModal)
        if(!remainingComponents) return

        setComponents(remainingComponents)
    }

    const toggleAddEditorModal = (newEditors?) => {
        setOpenAddEditorModal(!openAddEditorModal)
        if(!newEditors) return
        console.log(newEditors)
        setEditors(currentEditors => [...currentEditors, ...newEditors])
    }

    const toggleRemoveEditorModal = (remainingEditors?) => {
        setOpenRemoveEditorModal(!openRemoveEditorModal)
        if(!remainingEditors) return
        setEditors(remainingEditors)
    }

    const classes = useStyles()
    return (
        <>
        <Head>
            <title>{project.name}</title>
            <meta name="description" content={`The main project page for ${project.name}`} />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={true} user={user} />
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
                                <Typography variant="h3" className={classes.projectTitle}>
                                    {project.name}
                                </Typography>
                            </Box>
                            <hr style={{marginBottom: 0}} />
                            <BasicProjectInfo editors={editors} isPublic={project.public} />
                            <Box px={3} pb={3} className={classes.projectContent}>
                                {components.length === 0 ? <Box className={classes.noComponentsContainer}>
                                    <Box>
                                        <Typography variant="h6" className={classes.noComponentsTitle}>
                                            No Components Currently
                                        </Typography>
                                        <Box style={{textAlign: 'center'}}>
                                            <Button variant="contained" className={classes.newButton} 
                                            onClick={(e) => toggleNewComponentModal(null)}>
                                                Create One
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box> : <ComponentsList components={components} />}
                            </Box>
                        </Paper>
                    </Box>
                    <Box mb={3} px={3}>
                        <Paper className={classes.paper}>
                            <Box px={3}>
                                <Grid container direction="row" spacing={3}>
                                    <Grid item>
                                        <Button className={classes.newButton} onClick={(e) => toggleNewComponentModal(null)} >
                                            New Component
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button className={classes.deleteButton} onClick={(e) => toggleRemoveComponentModal(null)} >
                                            Remove Component
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Box>
                    {user._id === project.owner && <Box mb={3} px={3}>
                        <Paper className={classes.paper}>
                            <Box px={3}>
                                <Grid container direction="row" spacing={3}>
                                    <Grid item>
                                        <Button className={classes.newButton} onClick={() => toggleAddEditorModal()}>
                                            Invite a User
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button className={classes.deleteButton} onClick={() => toggleRemoveEditorModal()}>
                                            Remove a User
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Box>}
                </Grid>
            </Grid>
            <NewComponentDialog open={openModal} toggleOpen={toggleNewComponentModal} components={components}
            projectId={project._id} />
            <DeleteComponentDialog open={deleteModal} toggleOpen={toggleRemoveComponentModal} components={components}
            projectId={project._id} />
            <InviteEditorDialog open={openAddEditorModal} toggleOpen={toggleAddEditorModal} editors={editors}
            userId={user._id} projectId={project._id} />
            <RemoveEditorDialog open={openRemoveEditorModal} toggleOpen={toggleRemoveEditorModal} 
            editors={editors}
            projectId={project._id} />
        </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    try {
        const user:any = await getUser(ctx)
        const id = Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id
        if(!checkObjectId(id)) throw 'invalid objectid'

        const [projectInfo, serverComponents] = await Promise.all([ getProjectInfo(id),
        getComponents(new ObjectId(id))])
        
        verifyEditor(ctx, user._id, JSON.parse(JSON.stringify(projectInfo.editors)))

        return {props: {user, project: JSON.parse(JSON.stringify(projectInfo)), serverComponents: JSON.parse(JSON.stringify(serverComponents))}}
    } catch(e) {
        ctx.res.writeHead(500, {
            Location: `${process.env.BASE_ROUTE}/projects`
        })
        ctx.res.end()
        return {props: {}}
    } 
}