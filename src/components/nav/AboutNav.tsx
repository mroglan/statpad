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

export default function AboutNav({comp}) {

    const classes = useStyles()
    return (
        <Box>
            <Box mx="auto">
                <Breadcrumbs className={classes.crumbs} separator={<NavigateNextIcon fontSize="small" style={{color: 'rgba(255, 255, 255, .5)'}} />} aria-label="project navigation">
                    <Link href="/about">
                        <a className={classes.dimWhite}>About</a>
                    </Link>
                    <Link href={`/about/${comp.path}`}>
                        <a className={classes.white}>{comp.name}</a>
                    </Link>
                </Breadcrumbs>
            </Box>
        </Box>
    )
}