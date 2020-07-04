import {makeStyles} from '@material-ui/core/styles'
import { Grid, Typography, Box, Button } from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error';

interface ErrorBoxProps {
    msg: string;
    index: number;
    handleRemoveError: any;
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.error.light,
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

export default function ErrorBox({msg, index, handleRemoveError}:ErrorBoxProps) {

    const classes = useStyles()
    return (
        <Grid container spacing={3} wrap="nowrap" className={classes.root}>
            <Grid item className={classes.alignJustifyCenter}>
                <ErrorIcon />
            </Grid>
            <Grid item className={`${classes.messageCell} ${classes.alignJustifyCenter}`}>
                <Typography variant="h6">
                    {msg}
                </Typography>
            </Grid>
            <Grid item className={classes.alignJustifyCenter}>
                <Box className={classes.closeError}>
                    <Button onClick={(e) => handleRemoveError(index)}>
                        <Typography variant="h6" className={classes.textWhite}>X</Typography>
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}