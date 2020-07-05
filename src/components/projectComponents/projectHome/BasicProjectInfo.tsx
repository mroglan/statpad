import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import {Project, User} from '../projectInterfaces'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Paper, Box, Typography, Button, IconButton, Avatar, Tooltip} from '@material-ui/core'
import {useState} from 'react'
import Link from 'next/link'

const useStyles = makeStyles(theme => ({
    dimWhite: {
        color: 'rgba(255, 255, 255, .8)'
    },
    textWhite: {
        color: '#fff'
    },
    dropDownBtn: {
        paddingLeft: 0,
        color: '#fff',
        '&:hover': {
            backgroundColor: 'initial'
        }
    },
    orange: {
        color: 'hsla(31, 82%, 54%, .9)'
    }
}))

interface Props {
    editors: User[];
    isPublic: boolean;
}

export default function BasicProjectInfo({editors, isPublic}:Props) {

    const [displayEditors, setDisplayEditors] = useState(false)

    const toggleEditorView = () => {
        setDisplayEditors(!displayEditors)
    }

    const classes = useStyles()
    return (
        <Box px={3} pt={3}>
            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <Typography variant="h5" className={classes.dimWhite}>
                        {editors.length} Editors <IconButton className={classes.dropDownBtn}
                        disableFocusRipple disableRipple onClick={() => toggleEditorView()} >
                            <UnfoldMoreIcon />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h5" className={classes.dimWhite}>
                        {isPublic ? <span className={classes.orange}>Public</span> : 
                        <span className={classes.orange}>Private</span>}
                    </Typography> 
                </Grid>
            </Grid>
            {displayEditors && <Grid container spacing={3}>
                {editors.map((editor:User, index) => (
                    <Grid item key={index}>
                        <Link href="/profile/[id]" as={`/profile/${editor._id}`}>
                            <a>
                                <Tooltip title={editor.username}>
                                    <Avatar alt={editor.username} src={editor.image || '/users/blankProfile.png'} />
                                </Tooltip>
                            </a>
                        </Link>
                    </Grid>
                ))}
            </Grid>}
        </Box>
    )
}