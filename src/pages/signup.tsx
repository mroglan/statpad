import {makeStyles} from '@material-ui/core/styles'
import Header from '../components/nav/Header'
import {Grid, Paper, Box, Typography, FormGroup, TextField, Button} from '@material-ui/core'
import {Form, Formik, Field, useField, ErrorMessage} from 'formik'
import {object, string, number, boolean, array, mixed, ref} from 'yup'
import {useState} from 'react'
import router from 'next/router'
import ErrorBox from '../components/messageBox/ErrorBox'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import checkNotAuth from '../requests/checkNotAuth'
import Link from 'next/link'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    signUpContainer: {
        margin: '0 auto',
        animation: '$appear 400ms'
    },
    '@keyframes appear': {
        '0%': {
            opacity: 0,
            transform: 'scale(0)',
        },
        '100%': {
            opacity: 1,
            transform: 'scale(1)',
        }
    },
    paper: {
        backgroundColor: 'hsl(241, 92%, 60%)',
        position: 'relative',
        marginBottom: '1rem',
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
    lightPaper: {
        position: 'relative',
        marginBottom: '1rem',
        color: '#fff',
        padding: '1rem 5rem',
        backgroundColor: 'hsl(241, 80%, 50%)'
    },
    alignJustifyCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    link: {
        color: theme.palette.success.main,
        textDecorationColor: theme.palette.success.main
    }
}))

const initialValues = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
}

interface submitI {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export default function SignUp() {

    const [serverErrors, setServerError] = useState([])

    const handleSubmit = async (values, actions) => {
        const res = await fetch(`${process.env.API_ROUTE}/signup`, {
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
            setServerError(json)
            actions.setSubmitting(false)
            return
        }
        router.push({
            pathname: '/login',
            query: {signedUp: 'true'}
        })
    }

    const handleRemoveError = (index:number) => {
        console.log('removing error')
        const copy = [...serverErrors]
        copy.splice(index, 1)
        setServerError(copy)
    }

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={false} user={null} />
            <Grid container>
                <Grid item md={6} sm={8} className={classes.signUpContainer}>
                    <Paper className={classes.paper}>
                        <Grid container justify="center">
                            <Typography variant="h4" gutterBottom>Create an Account</Typography>
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
                                    username: string().required('A username is required').min(2).max(100),
                                    email: string().required('Email required').email('A valid email is needed'),
                                    password: string().required('A password is required').min(8).max(128),
                                    passwordConfirmation: string().when('password', {
                                        is: password => password && password.length > 0,
                                        then: string().oneOf([ref('password')], 'Passwords must match').required('You must confirm your password')
                                    })
                                })
                            } initialValues={initialValues} onSubmit={(values, actions) => {
                                handleSubmit(values, actions)
                            }}>
                                {({values, errors, isSubmitting, isValidating}) =>(
                                    <Form>
                                        <Box mb={2}>
                                            <FormGroup>
                                                <FormikTextField name="username" label="Username" InputProps={{classes: {
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
                                        <Box mb={2}>
                                            <FormGroup>
                                                <FormikTextField name="passwordConfirmation" type="password" label="Confirm Password" InputProps={{classes: {
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
                                                Sign Up!
                                            </Button>
                                        </Box>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </Paper>
                    <Box mt={3}>
                        <Paper className={classes.lightPaper}>
                            <Grid container spacing={1}>
                                <Grid item className={classes.alignJustifyCenter}>
                                    <Typography variant="h5">
                                        Already have an account?
                                    </Typography>
                                </Grid>
                                <Grid item className={classes.alignJustifyCenter}>
                                    <Link href="/login">
                                        <a className={classes.link}><Typography variant="h5">
                                            Login
                                        </Typography></a>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </div>
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

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    //console.log('in server side props')
    await checkNotAuth(ctx)
    return {props: {}}
}