import {makeStyles} from '@material-ui/core/styles'
import {Breadcrumbs, Paper, Box} from '@material-ui/core'
import Link from 'next/link'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.primary.dark,
        position: 'relative',
        marginBottom: '1rem',
        padding: '0 1rem'
    },
    white: {
        color: 'rgba(255, 255, 255, .8)',
        textDecoration: 'none'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .5)',
        textDecoration: 'none'
    },
    crumbs: {
        '& > ol': {
            justifyContent: 'center'
        },
        fontSize: '1.3rem'
    }
}))

export default function InnerProjectNav({tabs}) {

    const classes = useStyles()
    return (
        <Box>
            <Paper className={classes.paper}>
                <Box mx="auto">
                    <Breadcrumbs className={classes.crumbs} separator={<NavigateNextIcon fontSize="small" style={{color: 'rgba(255, 255, 255, .5)'}} />} aria-label="project navigation">
                        <Link href="/projects">
                            <a className={classes.dimWhite}>Projects</a>
                        </Link>
                        <Link href="/projects/[id]" as={`/projects/${tabs[0]._id}`}>
                            <a className={classes.dimWhite}>{tabs[0].name}</a>
                        </Link>
                        <Link href="/projects/[id]/[compId]" as={`/projects/${tabs[0]._id}/${tabs[1]._id}`}>
                            <a className={classes.white}>{tabs[1].name}</a>
                        </Link>
                    </Breadcrumbs>
                </Box>
            </Paper>
        </Box>
    )
}