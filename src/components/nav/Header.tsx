import {makeStyles} from '@material-ui/core/styles'
import {Grid, AppBar, Toolbar, Typography, Button, InputBase} from '@material-ui/core'
import Link from 'next/link'
import BarChartIcon from '@material-ui/icons/BarChart'
import SearchIcon from '@material-ui/icons/Search';
import logout from '../../requests/logout'
import MenuIcon from '@material-ui/icons/Menu'
import {useRef} from 'react'

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
    },
    logo: {
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    usefulLinks: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        }
    },
    otherHeaderInfo: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
            display: 'none',
            flexFlow: 'column wrap',
            alignItems: 'flex-end',
        }
    },
    showMenuBtn: {
        [theme.breakpoints.up('md')]: {
            display: 'none'
        },
        position: 'absolute',
        top: 32,
        right: '2rem',
        transform: 'translateY(-50%)',
        color: theme.palette.primary.main
    },
    flexGrowSmall: {
        [theme.breakpoints.down('sm')]: {
            flexGrow: 1
        }
    },
    toolbar: {
        [theme.breakpoints.down('sm')]: {
            display: 'block'
        },
        position: 'relative'
    },
    logoContainer: {
        height: 64,
        display: 'flex',
        alignItems: 'center'
    }
}))

export default function Header({loggedIn}) {

    const headInfoRef = useRef<HTMLDivElement>()

    const toggleMenu = () => {
        const currentStyles = headInfoRef.current.style
        if(currentStyles.display === 'flex') {
            currentStyles.display = 'none'
            return
        }
        currentStyles.display = 'flex'
    }

    const classes = useStyles()
    return (
        <AppBar position="sticky" className={classes.navBar}>
            <Toolbar className={classes.toolbar}>
                <div className={classes.logoContainer}>
                    <Typography variant="h6" className={classes.logo}>
                        <Link href="/"><a className={classes.link}>
                            <Typography variant="h4" className={classes.flex}><BarChartIcon style={{fontSize: 40}} />Statpad</Typography>
                        </a></Link>
                    </Typography>
                </div>
                <div className={classes.otherHeaderInfo} ref={headInfoRef}>
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
                    <div className={classes.usefulLinks}>
                        <Button color="inherit">About</Button>
                        <Button color="inherit">Tutorial</Button>
                        <Button color="inherit">
                            <Link href="/manual">
                                <a style={{color: 'inherit', textDecoration:'none'}}>Manual</a>
                            </Link>
                        </Button>
                    {!loggedIn ? <Button color="inherit">
                        <Link href="/login">
                            <a style={{color:'inherit', textDecoration:'none'}}>Login</a>
                        </Link>
                    </Button> : 
                    <Button color="inherit" onClick={(e) => logout()}>Logout</Button>}
                    </div>
                </div>
                <Button variant="contained" component="button" className={classes.showMenuBtn}
                onClick={(e) => toggleMenu()} >
                    <MenuIcon />
                </Button>
            </Toolbar>
        </AppBar>
    )
}