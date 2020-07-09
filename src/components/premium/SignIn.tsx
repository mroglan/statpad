import {makeStyles} from '@material-ui/core/styles'
import {Paper, Grid, Typography, Box, FormGroup, Button, TextField} from '@material-ui/core'
import ErrorBox from '../messageBox/ErrorBox'
import {useState} from 'react'
import {Formik, Form, useField, Field} from 'formik'
import {object, string} from 'yup'
import Router from 'next/router'

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
}))

const initialValues = {
    email: '',
    password: '',
}

export default function SignIn({changeStep}) {

    const [serverErrors, setServerErrors] = useState([])

    const handleSubmit = async (values, actions) => {
        const res = await fetch(`${process.env.API_ROUTE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
        console.log(res)
        const json = await res.json()
        console.log(json)
        if(res.status !== 200) {
            setServerErrors(json)
            actions.setSubmitting(false)
            return
        }
        changeStep(1)
    }

    const handleRemoveError = (index:number) => {
        console.log('removing error')
        const copy = [...serverErrors]
        copy.splice(index, 1)
        setServerErrors(copy)
    }

    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <Grid container justify="center">
                <Typography variant="h4" gutterBottom>Login to Statpad</Typography>
            </Grid>
            <Grid container>
                {serverErrors.map((error, index) => (
                    <Grid item xs={12} key={index} style={{marginBottom: '1rem'}}>
                        <ErrorBox msg={error.msg} index={index} handleRemoveError={handleRemoveError} />
                    </Grid>
                ))}
            </Grid>
            <Box>
                <Formik validationSchema={
                    object({
                        email: string().required('Email required'),
                        password: string().required('A password is required'),
                    })
                } initialValues={initialValues} onSubmit={(values, actions) => {
                    handleSubmit(values, actions)
                }}>
                    {({values, errors, isSubmitting, isValidating}) =>(
                        <Form>
                            <Box mb={2}>
                                <FormGroup>
                                    <FormikTextField name="email" label="Email" InputProps={{classes: {
                                            root: classes.input,
                                            error: classes.error
                                        }}}
                                        InputLabelProps={{classes: {
                                            root: classes.textField,
                                            error: classes.errorLabel
                                        }}}
                                        FormHelperTextProps={{classes: {
                                            root: classes.helperText,
                                            error: classes.helperTextError
                                        }}} />
                                </FormGroup>
                            </Box>
                            <Box mb={2}>
                                <FormGroup>
                                    <FormikTextField name="password" type="password" label="Password" InputProps={{classes: {
                                            root: classes.input,
                                            error: classes.error
                                        }}}
                                        InputLabelProps={{classes: {
                                            root: classes.textField,
                                            error: classes.errorLabel
                                        }}}
                                        FormHelperTextProps={{classes: {
                                            root: classes.helperText,
                                            error: classes.helperTextError
                                        }}} />
                                </FormGroup>
                            </Box>
                            <Box mx="auto" mt={3} style={{textAlign: 'center'}}>
                                <Button type="submit" disabled={isSubmitting || isValidating} className={classes.submitButton}>
                                    Login
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Paper>
    )
}

const FormikTextField = (props) => {
    const [field, meta] = useField({
        name: props.name,
        type: props.type || 'text',
    })
    return (
        <Field {...props} {...field} as={TextField} error={meta.touched && meta.error ? true : false} 
        helperText={meta.touched && meta.error ? meta.error : ''} />
    )
}