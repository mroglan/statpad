import {makeStyles, withStyles} from '@material-ui/core/styles'
import {Paper, Grid, Typography, Box, FormGroup, Button, TextField, FormControlLabel, Checkbox} from '@material-ui/core'
import ErrorBox from '../messageBox/ErrorBox'
import {useState} from 'react'

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: 'hsl(241, 92%, 60%)',
        position: 'relative',
        margin: '1rem 0',
        color: '#fff',
        padding: '1rem 5rem'
    },
    input: {
        color: '#fff',
        '&$error::after': {
            borderBottomColor: 'hsl(6, 90%, 57%)'
        }
    },
    textField: {
        color: 'rgba(255, 255, 255, .7)',
        '&$errorLabel': {
            color: 'hsl(6, 90%, 57%)'
        },
    },
    error: {},
    errorLabel: {},
    helperTextError: {},
    helperText: {
        '&$helperTextError': {
            color: 'hsl(6, 90%, 57%)'
        }
    },
    submitButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
    },
    errorText: {
        color: 'hsl(6, 90%, 57%)'
    }
}))

const GreenCheckbox:any = withStyles({
    root: {
      color: 'hsl(140, 81%, 25%)',
      '&$checked': {
        color: 'hsl(140, 81%, 31%)',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);


interface Props {
    info: {
        firstName: string;
        lastName: string;
        acceptedTermsAndConditions: boolean;
    };
    setInfo: any;
    changeStep: any;
}

export default function BasicInfo({info, setInfo, changeStep}:Props) {

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        acceptTerms: ''
    })

    const submitBasicInfo = () => {
        const foundErrors = {
            firstName: '',
            lastName: '',
            acceptTerms: ''
        }
        if(!info.firstName) foundErrors.firstName = 'You must specify a first name'
        if(!info.lastName) foundErrors.lastName = 'You must specify a last name'
        if(!info.acceptedTermsAndConditions) foundErrors.acceptTerms = 'You are required to understand you are wasting your money'

        if(foundErrors.firstName || foundErrors.lastName || foundErrors.acceptTerms) {
            setErrors(foundErrors)
            return
        }

        changeStep(1)
    }

    const changeFirstName = (e) => {
        if(errors.firstName && e.target.value.length > 0) setErrors({...errors, firstName: ''})
        setInfo({...info, firstName: e.target.value})
    }

    const changeLastName = (e) => {
        if(errors.lastName && e.target.value.length > 0) setErrors({...errors, lastName: ''})
        setInfo({...info, lastName: e.target.value})
    }

    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <Grid container justify="center">
                <Typography variant="h4" gutterBottom>Basic Information</Typography>
            </Grid>
            <Box>
                <Box mb={2}>
                    <TextField name="firstName" label="First name" value={info.firstName} 
                    onChange={(e) => changeFirstName(e)} InputProps={{classes: {
                        root: classes.input,
                        error: classes.error
                    }}} InputLabelProps={{classes: {
                        root: classes.textField,
                        error: classes.errorLabel
                    }}}
                    FormHelperTextProps={{classes: {
                        root: classes.helperText,
                        error: classes.helperTextError
                    }}} fullWidth
                    error={Boolean(errors.firstName)} helperText={errors.firstName} />
                </Box>
                <Box mb={4}>
                    <TextField name="lastName" label="Last name" value={info.lastName} 
                    onChange={(e) => changeLastName(e)} InputProps={{classes: {
                        root: classes.input,
                        error: classes.error
                    }}} InputLabelProps={{classes: {
                        root: classes.textField,
                        error: classes.errorLabel
                    }}}
                    FormHelperTextProps={{classes: {
                        root: classes.helperText,
                        error: classes.helperTextError
                    }}} fullWidth
                    error={Boolean(errors.lastName)} helperText={errors.lastName} />
                </Box>
                <Box mb={2}>
                    <FormControlLabel control={<GreenCheckbox checked={info.acceptedTermsAndConditions} 
                    onChange={() => setInfo({...info, acceptedTermsAndConditions: !info.acceptedTermsAndConditions})}
                    name="AcceptTermsAndConditions" />} label="I understand that I will not receive anything of value by 
                    purchasing this" />
                    {errors.acceptTerms && <Typography variant="body2" className={classes.errorText}>
                        {errors.acceptTerms}
                    </Typography>}
                </Box>
                <Box mx="auto" mt={3} style={{textAlign: 'center'}}>
                    <Button onClick={() => submitBasicInfo()} className={classes.submitButton}>
                        Continue
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}