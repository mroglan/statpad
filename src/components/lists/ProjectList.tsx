import {List, ListItem, ListItemIcon, ListItemText, Grid, Typography, IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Link from 'next/link'
import {useMemo} from 'react'
import {Project} from './listsInterfaces'
import EditIcon from '@material-ui/icons/Edit';
import {useState, MouseEvent} from 'react'
import EditProjectDialog from '../dialogs/editProjectDialog'

const useStyles = makeStyles(theme => ({
    textWhite: {
        color: '#fff'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .7)'
    },
    displaySmUp: {
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        }
    },
    editButton: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: 'rgba(255, 255, 255, .7) ',
        fontSize: '.7rem',
        opacity: 0,
        position: 'absolute',
        zIndex: 12,
        padding: 3,
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)',
            color: '#fff'
        },
    },
    projectGrid: {
        '&:hover': {
            '& button': {
                opacity: 1
            }
        }
    }
}))

interface Props {
    projects: Project[]
}

interface NewInfo {
    name: string;
    description: string;
}

export default function ProjectList({projects}:Props) {

    const [viewEditModal, setViewEditModal] = useState(-1)
    const [stateProjects, setStateProjects] = useState(projects)

    useMemo(() => setStateProjects(projects), [projects])

    const formattedDate = (inputDate:string) => {
        const date = new Date(inputDate)
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date ) 
        return `${day}-${month}-${year}`
    }

    const toggleEditModal = (editIndex:number, newInfo?:NewInfo) => {
        setViewEditModal(current => current === editIndex ? -1 : editIndex)
        if(!newInfo) return
        const copy = [...stateProjects]
        copy[editIndex] = {
            ...copy[editIndex],
            name: newInfo.name,
            description: newInfo.description
        }
        setStateProjects(copy)
    }

    const handleEditClick = (e:MouseEvent, editIndex:number) => {
        e.preventDefault()
        toggleEditModal(editIndex)
    }

    const classes = useStyles()
    return (
        <List style={{width: '100%'}}>
            {stateProjects.map((project, index) => (
                <Link href="/projects/[id]" as={`/projects/${project._id}`} key={index}>
                    <ListItem button>
                        <Grid container wrap="nowrap" className={classes.projectGrid} spacing={5}>
                            <Grid item style={{flexGrow: 1}}>
                                <Typography variant="h4" className={classes.textWhite}>
                                    {project.name}
                                </Typography>
                                <Typography variant="body1" className={`${classes.dimWhite} ${classes.displaySmUp}`}>
                                    {project.description}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" className={classes.dimWhite}>
                                    {formattedDate(project.updateDate)}
                                </Typography>
                            </Grid>
                            <IconButton className={classes.editButton} onClick={(e) => handleEditClick(e, index)} >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </ListItem>
                </Link>
            ))}
            {viewEditModal > -1 && <EditProjectDialog open={true} toggleOpen={toggleEditModal} project={projects[viewEditModal]} 
            index={viewEditModal} />}
        </List>
    )
}