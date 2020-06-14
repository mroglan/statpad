import {makeStyles} from '@material-ui/core/styles'
import { Grid, Typography, Box, Button } from '@material-ui/core'
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';

interface ErrorBoxProps {
    msg: string;
    handleRemoveSuccess: any;
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        borderRadius: '3rem'
    },
    messageCell: {
        flexGrow: 1
    },
    alignJustifyCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeError: {
        borderRadius: '50%',
        backgroundColor: 'inherit',
        color: '#fff',
        width: '2rem',
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    }, 
    textWhite: {
        color: '#fff'
    }
}))

export default function ErrorBox({msg, handleRemoveSuccess}:ErrorBoxProps) {

    const classes = useStyles()
    return (
        <Grid container spacing={3} className={classes.root}>
            <Grid item className={classes.alignJustifyCenter}>
                <DirectionsRunIcon />
            </Grid>
            <Grid item className={`${classes.messageCell} ${classes.alignJustifyCenter}`}>
                <Typography variant="h6">
                    {msg}
                </Typography>
            </Grid>
            <Grid item className={classes.alignJustifyCenter}>
                <Box className={classes.closeError}>
                    <Button onClick={(e) => handleRemoveSuccess()}>
                        <Typography variant="h6" className={classes.textWhite}>X</Typography>
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}