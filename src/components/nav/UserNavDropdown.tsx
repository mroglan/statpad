import {MenuItem, MenuList, ClickAwayListener, Paper, Popper, Avatar, Typography} from '@material-ui/core'
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined'
import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Link from 'next/link'
import logout from '../../requests/logout'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
    },
    menuItem: {
        padding: '.4rem 1rem',
        backgroundColor: 'transparent',
        color: '#fff',
    },
    container: {
        backgroundColor: '#556cd6'
    },
    typo: {
        color: 'inherit',
    }
}))

export default function UserNavDropDown({user}) {

    const [anchorEl, setAnchorEl] = useState(null)

    const handleAvatarClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Avatar alt={user.name} src={user.image || '/users/blankProfile.png'} onClick={(e) => handleAvatarClick(e)} />
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} role="nav" transition style={{zIndex: 13}}
            placement="bottom-end" >
                <Paper elevation={3} className={classes.container}>
                    <ClickAwayListener onClickAway={handleClose}>
                        <div>
                        <Link href="/profile">
                            <a style={{textDecoration: 'none', color: 'inherit'}}>
                                <MenuItem className={classes.menuItem}>
                                    <Typography variant="button" className={classes.typo}>
                                        My Profile
                                    </Typography>
                                </MenuItem>
                            </a>
                        </Link>
                        <Link href="/dashboard">
                            <a style={{textDecoration: 'none', color: 'inherit'}}>
                                <MenuItem className={classes.menuItem}>
                                    <Typography variant="button" className={classes.typo}>
                                        Dashboard
                                    </Typography>
                                </MenuItem>
                            </a>
                        </Link>
                        <MenuItem onClick={() => logout()} className={classes.menuItem}>
                            <Typography variant="button" className={classes.typo}>
                                Logout
                            </Typography>
                        </MenuItem>
                        </div>
                    </ClickAwayListener>
                </Paper>
            </Popper> 
        </div>
    )
}