import {makeStyles} from '@material-ui/core/styles'
import {Box, Typography, Stepper, Step, StepLabel} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    step: {
        '& circle': {
            color: 'hsl(37, 82%, 46%)'
        }
    },
    completedStep: {
        '& path': {
            color: 'hsl(37, 82%, 62%)'
        }
    },
    stepper: {
        background: `linear-gradient(360deg, ${theme.palette.primary.dark}, hsl(241, 82%, 50%))`, 
        borderRadius: '10px'
    },
    label: {
        color: '#fff',
    },
    sideLabel: {
        color: 'rgba(255, 255, 255, .8)'
    }
}))

export default function CheckoutWizard({currentStep}) {

    const steps = [
        'Sign In', 'Basic Info', 'Payment Method', 'Purchase Premium'
    ]

    const classes = useStyles() 
    return (
        <Box>
            <Stepper activeStep={currentStep} alternativeLabel className={classes.stepper}>
                {steps.map((label:string, index:number) => (
                    <Step key={label} className={classes.step} classes={{completed: classes.completedStep}}>
                        <StepLabel>
                            <Typography className={index === currentStep ? classes.label : classes.sideLabel} variant="body1">
                                {label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}