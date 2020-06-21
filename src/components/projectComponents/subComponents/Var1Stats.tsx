import { Grid, Input, Typography, Button, Box, FormControl, InputLabel, Select, MenuItem, Switch } from "@material-ui/core";
import {useState, useMemo, useEffect} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import calc1VarStats from '../../../utilities/calcVar1Stats'

interface statProps {
    rows: any;
    basic: boolean;
    syncData: any;
    sync: boolean;
    index: number;
    initialGraph: any;
}

const useStyles = makeStyles(theme => ({
    textWhite: {
        color: '#fff'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 200,
        '& > div': {
            border: '1px solid hsl(241, 82%, 90%)',
            borderRadius: '1rem'
        }
    },
    flexAlignCenter: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center'
    },
    paddingBottom: {
        paddingBottom: '1rem',
        paddingTop: '1rem'
    },
    flexJustifyCenter: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexJustifyRight: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    sidePadding: {
        paddingRight: '3rem',
        paddingLeft: '3rem'
    },
    darkerBg: {
        backgroundColor: 'hsl(241, 82%, 46%)'
    }
}))

export default function Var1Stats({rows, basic, syncData, index, sync, initialGraph}:statProps) {

    const [list, setList] = useState(!basic ? initialGraph.properties : 0)

    useEffect(() => {
        if(!sync) return
        console.log('syncing data ' + index)
        const uploadData = async () => {
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/updategraph`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: initialGraph._id,
                    properties: list,
                    charts: 0
                })
            })
            if(res.status !== 200) {
                syncData(index, false)
                return
            }
            syncData(index, true)
        }
        uploadData()
    }, [sync])

    const handleListChange = (e:any) => {
        setList(e.target.value)
    }

    const stats = useMemo(() => {
        const values = rows.map((row, index) => {
            if(index === 0) return
            return row[list] ? Number(row[list]) : null
        }).filter(val => val)
        return calc1VarStats(values)
    }, [list, rows])

    const classes = useStyles()
    return (
        <Grid container>
            <Grid item xs={12} className={`${classes.flexAlignCenter} ${classes.paddingBottom}`}>
                <Box mx="auto" className={classes.flexAlignCenter}>
                    <Typography variant="h5" style={{paddingRight: '1rem'}} className={`${classes.textWhite}`}>
                        1 Var Stats for
                    </Typography>
                    <FormControl variant="filled" className={classes.formControl} hiddenLabel margin="dense">
                        <Select disableUnderline={true} 
                        value={list} onChange={(e) => handleListChange(e)} aria-label="List"
                        classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                            {rows[0].map((row:any, colIndex:number) => {
                                return (
                                <MenuItem key={'list ' + colIndex} value={colIndex}>{row || 'no title'}</MenuItem>
                            )})}
                        </Select>
                    </FormControl> 
                </Box>
            </Grid>
            <Grid item xs={12} container direction="row" justify="space-between" alignItems="center" 
            className={`${classes.paddingBottom} ${classes.sidePadding}`}>
                <Grid item container sm={4} className={classes.flexAlignCenter}>
                    <Typography variant="h6" className={classes.textWhite}>
                        Mean: {stats.mean.toFixed(4)}
                    </Typography>
                </Grid>
                <Grid item container className={classes.flexJustifyCenter} sm={4}>
                    <Typography variant="h6" className={classes.textWhite}>
                        Median: {stats.median}
                    </Typography>
                </Grid>
                <Grid item container className={classes.flexJustifyRight} sm={4}>
                    <Typography variant="h6" className={classes.textWhite}>
                        Mode: {stats.mode}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} container direction="row" justify="space-between" alignItems="center" 
            className={`${classes.paddingBottom} ${classes.sidePadding} ${classes.darkerBg}`}>
                <Grid item container sm={3} className={classes.flexAlignCenter}> 
                    <Typography variant="h6" className={classes.textWhite}>
                        Min: {stats.min}
                    </Typography>
                </Grid>
                <Grid item className={classes.flexJustifyCenter} container sm={3}>
                    <Typography variant="h6" className={classes.textWhite}>
                        Q1: {stats.q1}
                    </Typography>
                </Grid>
                <Grid item className={classes.flexJustifyCenter} container sm={3}>
                    <Typography variant="h6" className={classes.textWhite}>
                        Q3: {stats.q3}
                    </Typography>
                </Grid>
                <Grid item className={classes.flexJustifyRight} container sm={3}>
                    <Typography variant="h6" className={classes.textWhite}>
                        Max: {stats.max}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} container direction="row" justify="space-around" alignItems="center" 
            className={`${classes.paddingBottom} ${classes.sidePadding} `}>
                <Grid item>
                    <Typography variant="h6" className={classes.textWhite}>
                        Pop. SD: {stats.popStd.toFixed(4)}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" className={classes.textWhite}>
                        Sample SD: {stats.sampleStd.toFixed(4)}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}