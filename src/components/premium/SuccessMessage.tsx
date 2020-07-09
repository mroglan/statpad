import {makeStyles} from '@material-ui/core/styles'
import {Paper, Grid, Box, Typography, Button} from '@material-ui/core'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Link from 'next/link'

const useStyles = makeStyles(theme => ({
    textSuccess: {
        color: theme.palette.success.main
    },
    textWhite: {
        color: '#fff'
    },
    icon: {
        fontSize: '100px'
    },
    submitButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
    },
}))

export default function SuccessMessage() {

    const classes = useStyles()
    return (
        <Box>
            <Box my={3} textAlign="center" className={classes.textSuccess}>
                <CheckCircleOutlineIcon className={classes.icon} fontSize="large" />
            </Box>
            <Box my={3} textAlign="center">
                <Typography variant="h6" className={classes.textWhite}>
                    Congratulations, you are now a premium stat padder!
                </Typography>
            </Box>
            <Box my={3} textAlign="center">
                <Link href="/dashboard">
                    <a style={{textDecoration: 'none'}}>
                        <Button className={classes.submitButton}>
                            Return to Dashboard
                        </Button>
                    </a>    
                </Link>
            </Box>
        </Box>
    )
}