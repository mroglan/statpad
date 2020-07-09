import { GetServerSideProps, GetServerSidePropsContext } from "next";
import getUser from "../../requests/getUser";
import getProjects from '../../requests/getProjects'
import database from '../../database/database'
import SideNav from '../../components/nav/SideNav'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Paper, Button, Box, Typography, FormControl, Select, MenuItem} from '@material-ui/core'
import Header from '../../components/nav/Header'
import ProjectList from '../../components/lists/ProjectList'
import Link from 'next/link'
import {ObjectId} from 'mongodb'
import {useState, useMemo} from 'react'
import DeleteProjectDialog from '../../components/dialogs/deleteProjectDialog'
import LeaveProjectDialog from '../../components/dialogs/leaveProjectDialog'
import Router from 'next/router'

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
    },
    deleteButton: {
        backgroundColor: 'hsla(348, 91%, 40%, 1)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsla(348, 91%, 40%, .9)'
        },
        margin: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 200,
        '& > div': {
            border: '1px solid hsl(241, 82%, 90%)',
            borderRadius: '1rem'
        }
    },
}))

export default function Projects({user, serverProjects}) {

    const [viewDeleteModal, setViewDeleteModal] = useState(false)
    const [viewLeaveModal, setViewLeaveModal] = useState(false)
    const [owned, setOwned] = useState(true)
    const [projects, setProjects] = useState(serverProjects)

    const filteredProjects = useMemo(() => {
        if(owned) {
            return projects.filter(proj => proj.owner === user._id)
        } else {
            return projects.filter(proj => proj.owner !== user._id)
        }
    }, [owned, projects])

    const toggleRemoveComponentModal = (remainingProjects) => {
        setViewDeleteModal(!viewDeleteModal)
        if(!remainingProjects) return

        console.log(remainingProjects)
        setProjects(remainingProjects)
    }

    const toggleLeaveProjectModal = (remainingProjects?) => {
        setViewLeaveModal(!viewLeaveModal)
        if(!remainingProjects) return
        setProjects(remainingProjects)
    }

    const classes = useStyles()
    return (
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
                                <Typography variant="h3" className={classes.title}>
                                    My Projects
                                </Typography>
                            </Box>
                            <hr style={{marginBottom: 0}} />
                            <Box px={3} pt={3}>
                                <FormControl variant="filled" className={classes.formControl} hiddenLabel margin="dense">
                                    <Select disableUnderline={true} 
                                    value={owned} onChange={(e) => setOwned(e.target.value === 'true')} aria-label="Project Filter"
                                    classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                        <MenuItem value={'true'}>Owned by me</MenuItem>
                                        <MenuItem value={'false'}>Shared with me</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box px={3} pb={3} className={classes.content}>
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
                                </Box> : <ProjectList editable={owned} projects={filteredProjects} />}
                            </Box>
                        </Paper>
                    </Box>
                    <Box mb={3} px={3}>
                        <Paper className={classes.paper}>
                            <Box px={3}>
                                <Grid container direction="row" spacing={3}>
                                    <Grid item>
                                    <Link href="/projects/newproject">
                                        <a style={{textDecoration: 'none', color: 'inherit'}}>
                                            <Button className={classes.newButton} variant="contained">
                                                New Project
                                            </Button>
                                        </a>
                                    </Link>
                                    </Grid>
                                    <Grid item>
                                        {owned ? <Button className={classes.deleteButton} onClick={(e) => toggleRemoveComponentModal(null)} >
                                            Remove Project
                                        </Button> : <Button className={classes.deleteButton} onClick={(e) => toggleLeaveProjectModal()} >
                                            Leave Project
                                        </Button>}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
            <DeleteProjectDialog open={viewDeleteModal} toggleOpen={toggleRemoveComponentModal} projects={projects}
            owner={user._id} />
            <LeaveProjectDialog open={viewLeaveModal} toggleOpen={toggleLeaveProjectModal} projects={projects} 
            owner={user._id} />
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user:any = await getUser(ctx)
    
    //console.log(user)
    const projects = await getProjects({'editors': new ObjectId(user._id)})

    return {props: {user, serverProjects: JSON.parse(JSON.stringify(projects))}}
}