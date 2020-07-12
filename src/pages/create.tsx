import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../components/nav/Header'
import DataTable from '../components/projectComponents/graphSubs/DataTable'
import {useState, useEffect} from 'react'
import Graph from '../components/projectComponents/graphSubs/Graph'
import MixedGraph from '../components/projectComponents/graphSubs/MixedGraph'
import Var1Stats from '../components/projectComponents/graphSubs/Var1Stats'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../requests/authenticated'
import getUser from '../requests/getUser'
import Head from 'next/head'

const useStyles = makeStyles(theme => ({
    root: {
        //backgroundColor: 'hsl(241, 82%, 43%)',
        minHeight: '100vh',
    },
    dataColor: {
        color: 'hsl(241, 82%, 90%)'
    },
    paper: {
        backgroundColor: 'hsl(241, 82%, 50%)',
        position: 'relative',
        marginBottom: '1rem'
    },
    centered: {
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    addColBtn: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateX(50%) translateY(-50%)',
    },
    addRowBtn: {
        position: 'absolute',
        bottom: 0,
        right: '50%',
        transform: 'translateX(50%) translateY(50%)',
    },
    addBtn: {
        zIndex: 12,
        backgroundColor: theme.palette.primary.dark,
        color: '#fff',
    },
    newButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        },
        margin: theme.spacing(1)
    },
    newButtonsContainer: {
        paddingTop: theme.spacing(4)
    },
    syncButton: {
        color: 'hsl(140, 81%, 31%)',
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
    loadIn: {
        animation: '$appear 400ms'
    },
    stickyTable: {
        [theme.breakpoints.up('md')]: {
            position: 'sticky',
            top: '10%'
        }
    },
    deleteGraphButton: {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 12,
        color: theme.palette.error.dark,
        opacity: .5,
        '&:hover': {
            background: 'none',
            opacity: 1,
            transform: 'scale(1.1)'
        }
    }
}))


export default function Create({loggedIn, user}) {

    const [graphs, setGraphs] = useState(['graph'])

    const [graphRows, setGraphRows] = useState([
        [null, null], [null, null], [null, null], [null, null], [null, null], [null, null]
    ])

    const syncData = (newRows) => {
        setGraphRows(newRows)
    }

    const addGraph = () => {
       setGraphs([...graphs, 'graph'])
    }

    const addMixedGraph = () => {
        setGraphs([...graphs, 'mixedGraph'])
    }

    const add1VarStats = () => {
        setGraphs([...graphs, '1varStats'])
    }

    const deleteGraph = (index:number) => {
        const graphsCopy = [...graphs]
        console.log(index)
        graphsCopy[index] = null
        setGraphs(graphsCopy)
    }

    const initialData = [
        ['', ''], ['', ''], ['', ''],
        ['', ''], ['', ''], ['', '']
    ]
    
    const classes = useStyles()

    return (
        <>
        <Head>
            <title>Basic Create | Statpad</title>
            <link rel="icon" type="image/png" href="https://res.cloudinary.com/dqtpxyaeo/image/upload/v1594509878/webpage/kbe7kwyavz3ye7fxamnl.png" />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            <Grid container spacing={3}>
                <Grid item md={graphRows[0].length === 2 ? 4 : graphRows[0].length === 3 || graphRows[0].length === 4 ? 8 : 12}
                 className={`${classes.centered} ${classes.loadIn}`} >
                    <DataTable syncData={syncData} initialData={initialData} syncing={false} basic={true} />
                    <Box className={graphRows[0].length < 3 ? classes.stickyTable : ''}>
                        <Grid container direction={graphRows[0].length === 2 ? 'column' : 'row'} justify="center" alignItems="center" className={classes.newButtonsContainer}>
                            <Button variant="contained" className={classes.newButton} onClick={(e) => addGraph()}>
                                New Graph
                            </Button>
                            <Button variant="contained" className={classes.newButton} onClick={(e) => addMixedGraph()}>
                                New Mixed Graph
                            </Button>
                            <Button variant="contained" className={classes.newButton} onClick={(e) => add1VarStats()}>
                                1 Var Stats
                            </Button>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item md={graphRows[0].length === 2 ? 8 : 12}>
                    {graphs.map((graph, index) => {
                        if(!graph) return
                        if(graph === 'graph') {
                            return (
                                <Paper key={index} elevation={3} className={`${classes.loadIn} ${classes.paper}`}>
                                    <IconButton disableRipple aria-label="remove regression" className={classes.deleteGraphButton}
                                    onClick={(e) => deleteGraph(index)} >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <Graph rows={graphRows} basic={true} sync={false} syncData={null} initialGraph={null} index={null} />
                                </Paper>
                            )
                        } if(graph === 'mixedGraph') {
                            return (
                                <Paper key={index} elevation={3} className={`${classes.loadIn} ${classes.paper}`}>
                                    <IconButton disableRipple aria-label="remove regression" className={classes.deleteGraphButton}
                                    onClick={(e) => deleteGraph(index)} >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <MixedGraph rows={graphRows} basic={true} sync={false} syncData={null} initialGraph={null} index={null} />
                                </Paper>
                            )
                        } if(graph === '1varStats') {
                            return (
                                <Paper key={index} elevation={3} className={`${classes.loadIn} ${classes.paper}`}>
                                    <IconButton disableRipple aria-label="remove regression" className={classes.deleteGraphButton}
                                    onClick={(e) => deleteGraph(index)} >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <Var1Stats rows={graphRows} basic={true} sync={false} syncData={null} initialGraph={null} index={null} />
                                </Paper>
                            )
                        }
                    })}
                </Grid>
            </Grid>
        </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    const user = isAuth ? await getUser(ctx) : null
    console.log(isAuth)
    return {props: {loggedIn: isAuth, user}}
}