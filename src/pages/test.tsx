import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, Select, InputLabel, MenuItem} from '@material-ui/core'
import Header from '../components/nav/Header'
import DataTable from '../components/test'
import {useState, useEffect} from 'react'
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab'
import FormControl from '@material-ui/core/FormControl'
import Graph from '../components/Graph'
import SyncIcon from '@material-ui/icons/Sync';
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(theme => ({
    root: {
        //backgroundColor: 'hsl(241, 82%, 43%)',
        minHeight: '100vh',
    },
    dataColor: {
        color: 'hsl(241, 82%, 90%)'
    },
    paperBG: {
        backgroundColor: 'hsl(241, 82%, 50%)',
        position: 'relative'
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
    }
}))


export default function Create() {

    const [graphRows, setGraphRows] = useState([
        [null, null], [null, null], [null, null], [null, null], [null, null], [null, null]
    ])

   const syncData = (newRows) => {
        setGraphRows(newRows)
   }
    
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Header />
            <Grid container spacing={3}>
                <Grid item md={graphRows[0].length === 2 ? 4 : graphRows[0].length === 3 || graphRows[0].length === 4 ? 8 : 12} className={classes.centered}>
                    <DataTable syncData={syncData} />
                    <Grid container direction={graphRows[0].length === 2 ? 'column' : 'row'} justify="center" alignItems="center" className={classes.newButtonsContainer}>
                        <Button variant="contained" className={classes.newButton}>
                            New Graph
                        </Button>
                        <Button variant="contained" className={classes.newButton}>
                            New Mixed Graph
                        </Button>
                        <Button variant="contained" className={classes.newButton}>
                            1 Var Stats
                        </Button>
                        <Button variant="contained" className={classes.newButton}>
                            2 Var Stats
                        </Button>
                    </Grid>
                </Grid>
                <Grid item md={graphRows[0].length === 2 ? 8 : 12}>
                    <Paper elevation={3} className={classes.paperBG}>
                        <Graph rows={graphRows} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}