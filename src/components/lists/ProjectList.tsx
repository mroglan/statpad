import {List, ListItem, ListItemIcon, ListItemText, Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Link from 'next/link'
import {useMemo} from 'react'
import {Project} from './listsInterfaces'

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
    }
}))

interface Props {
    projects: Project[]
}

export default function ProjectList({projects}:Props) {

    const formattedDate = (inputDate:string) => {
        const date = new Date(inputDate)
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date ) 
        return `${day}-${month}-${year}`
    }

    const classes = useStyles()
    return (
        <List style={{width: '100%'}}>
            {projects.map((project, index) => (
                <Link href="/projects/[id]" as={`/projects/${project._id}`} key={index}>
                    <ListItem button>
                        <Grid container wrap="nowrap" spacing={5}>
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
                        </Grid>
                    </ListItem>
                </Link>
            ))}
        </List>
    )
}