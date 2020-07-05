import {makeStyles} from '@material-ui/core/styles'
import Header from '../../components/nav/Header'
import {Grid, Paper, Box, Typography, FormGroup, TextField, Button, RadioGroup, Radio} from '@material-ui/core'
import {Form, Formik, Field, useField, ErrorMessage} from 'formik'
import {object, string, number, boolean, array, mixed, ref} from 'yup'
import {useState} from 'react'
import router from 'next/router'
import ErrorBox from '../../components/messageBox/ErrorBox'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/checkNotAuth'
import Link from 'next/link'
import SideNav from '../../components/nav/SideNav'
import getUser from '../../requests/getUser'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    }, 
    sideBar: {
        animation: '$appear 400ms',
        position: 'sticky',
        top: '10%',
        backgroundColor: 'hsl(241, 82%, 60%)',
        [theme.breakpoints.down('sm')]: {
            '& nav': {
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center',
                maxWidth: 600,
                [theme.breakpoints.down('xs')]: {
                    maxWidth: 300
                },
                '& > div': {
                    flexBasis: 300,
                    border: 'none'
                }
            }
        }
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
    mainContent: {
        animation: '$appear 400ms',
        margin: '0 auto',
    },
    paper: {
        backgroundColor: 'hsl(241, 92%, 60%)',
        position: 'relative',
        marginBottom: '1rem',
        color: '#fff',
        padding: '1rem 3rem'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .7)'
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
    pathContainer: {
        display: 'flex',
        flexFlow: 'row wrap',
    },
    pathInput: {
        flexBasis: 200
    },
    pathInputLg: {
        flexBasis: 250
    }, 
    pathSlash: {
        color: '#fff',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    textWhite: {
        color: '#fff'
    },
    radio: {
        '&$checked': {
            color: theme.palette.success.main
        }
    },
    checked: {},
    createButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
        margin: theme.spacing(1)
    }
}))

export default function CreateProject({user}) {

    const initialValues = {
        name: '',
        owner: user._id,
        description: '',
        public: true
    }

    const [serverErrors, setServerError] = useState([])

    const handleRemoveError = (index:number) => {
        console.log('removing error')
        const copy = [...serverErrors]
        copy.splice(index, 1)
        setServerError(copy)
    }

    const handleSubmit = async (values, actions) => {
        const res = await fetch(`${process.env.API_ROUTE}/projects/newproject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })

        const json = await res.json()
        if(res.status !== 200) {
            setServerError(json)
            actions.setSubmitting(false)
            return
        }
        //const id = json.ops[0]._id
        console.log(json)
        router.push(`/projects/${json}`)
    }

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={true} user={user} />
            <Grid container spacing={3}>
                <Grid item md={3} style={{margin: '0 auto'}}>
                    <Paper className={classes.sideBar}>
                        <SideNav />
                    </Paper>
                </Grid>
                <Grid item className={classes.mainContent} md={8} sm={10} xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container direction="column" style={{marginBottom: '2rem'}}>
                            <Box>
                                <Typography variant="h4" gutterBottom>Create a new Project</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" className={classes.dimWhite}>
                                    A project contains your data, graphs, and tests. You can share it with other users or
                                    keep it private.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid container>
                            {serverErrors.map((error, index) => (
                                <Grid item xs={12} key={index} style={{marginBottom: '1rem'}}>
                                    <ErrorBox msg={error.msg} index={index} handleRemoveError={handleRemoveError} />
                                </Grid>
                            ))}
                        </Grid>
                        <Formik validationSchema={
                            object({
                                name: string().required('You must specify a Project Name').max(50),
                                description: string(),
                                public: boolean()
                            })
                        } initialValues={initialValues} onSubmit={(values, actions) => handleSubmit(values, actions)} >
                            {({values, isSubmitting, isValidating, setFieldValue}) => (
                                <Form>
                                    <Box mb={2} className={classes.pathContainer}>
                                        <FormGroup className={classes.pathInput}>
                                            <TextField label="Owner" variant="outlined" disabled value={user.username} name="owner"
                                            InputProps={{classes: {
                                                disabled: classes.input
                                            }}} />
                                        </FormGroup>
                                        <Box mx={3}>
                                            <Typography variant="h3" className={classes.pathSlash}> / </Typography>
                                        </Box>
                                        <FormGroup className={classes.pathInputLg}>
                                            <FormikTextField name="name" label="Project Name" variant="outlined" InputProps={{classes: {
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
                                        <div style={{flexGrow: 1}} />
                                    </Box>
                                    <Box mb={2}>
                                        <FormGroup>
                                            <FormikTextField name="description" label="Optional Description" variant="outlined" InputProps={{classes: {
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
                                            <RadioGroup aria-label="privacy" name="privacy">
                                                <Grid container alignItems="center" wrap="nowrap"
                                                style={{marginBottom: '1rem'}} >
                                                    <Grid item>
                                                        <Radio value={true} checked={values.public} 
                                                        onChange={(e) => setFieldValue('public', true)}
                                                        classes={{root: classes.radio, checked: classes.checked}} />
                                                    </Grid>
                                                    <Grid item style={{flexGrow: 1}}>
                                                        <Typography variant="h5" className={classes.textWhite}>
                                                            Public
                                                        </Typography>
                                                        <Typography variant="body1" className={classes.dimWhite}>
                                                            Anyone will be able to see your project but you choose who can edit it.
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container alignItems="center" wrap="nowrap">
                                                    <Grid item>
                                                        <Radio value={false} checked={!values.public}
                                                        onChange={(e) => setFieldValue('public', false)}
                                                        classes={{root: classes.radio, checked: classes.checked}} />
                                                    </Grid>
                                                    <Grid item style={{flexGrow: 1}}>
                                                        <Typography variant="h5" className={classes.textWhite}>
                                                            Private
                                                        </Typography>
                                                        <Typography variant="body1" className={classes.dimWhite}>
                                                            Only people you invite to edit will be able to see your project.
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </RadioGroup>
                                        </FormGroup>
                                    </Box>
                                    <Box mt={3}>
                                        <Button type="submit" className={classes.createButton}>
                                            Create Project
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user = await getUser(ctx)
    return {props: {user}}
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

