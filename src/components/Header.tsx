import {makeStyles} from '@material-ui/core/styles'
import {Grid, AppBar, Toolbar, Typography, Button, InputBase} from '@material-ui/core'
import Link from 'next/link'
import BarChartIcon from '@material-ui/icons/BarChart'
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        color: theme.palette.primary.light
    },
    grow: {
        flexGrow: 1,
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    },
    flex: {
        display: 'flex',
        alignContent: 'center'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'hsl(241, 82%, 50%)',
        '&:hover': {
          backgroundColor: 'hsl(241, 82%, 60%)',
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      },
      searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
    },
    navBar: {
        position: 'sticky',
        top: 0,
        zIndex: 13,
        marginBottom: theme.spacing(3)
    }
}))

export default function Header() {
    const classes = useStyles()
    return (
        <AppBar position="sticky" className={classes.navBar}>
            <Toolbar>
                <Typography variant="h6">
                    <Link href="/"><a className={classes.link}>
                        <Typography variant="h4" className={classes.flex}><BarChartIcon style={{fontSize: 40}} />Statpad</Typography>
                    </a></Link>
                </Typography>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                    <SearchIcon />
                    </div>
                    <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </div>
                <div className={classes.grow}></div>
                <Button color="inherit">About</Button>
                <Button color="inherit">Tutorial</Button>
                <Button color="inherit">Manual</Button>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}