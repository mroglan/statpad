import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    parentCell: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column'
    },
    whiteBorder: {
        //border: '1px solid #fff'
    },
    nameInput: {
        maxWidth: '75%'
    },
    textWhite: {
        color: '#fff'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .5)'
    },
    textSuccess: {
        color: theme.palette.success.main
    },
    sideBorder: {
        borderRight: '1px solid rgba(255, 255, 255, .5)',
        borderLeft: '1px solid rgba(255, 255, 255, .5)'
    }
}))

interface TreeDiagramI {
    data:any;
    syncData:any;
    sync:boolean;
    index:number;
}

interface RowI {
    name: string;
    probability: number;
    children?: RowI[];
}

const fakeData = {
    name: 'name 1',
    probability: 1,
    children: [
        {name: 'name 2', probability: .5, children: [
            {name: 'name 3', probability: .2},
            {name: 'name 3.5', probability: .8, children: [
                {name: 'name 4',probability: .5}, {name: 'name 5', probability: .5},// {name: 'name 6', probability: '1'}, {name: 'name 6', probability: '1'}
            ]}
        ]},
        {name: 'name 2.5', probability: .5, children: [
            {name: 'name 3', probability: .2},
            {name: 'name 3.5', probability: .8, children: [
                {name: 'name 4',probability: .5}, {name: 'name 5', probability: .5}
            ]}
        ]}
    ]
}

export default function TreeDiagram({data, syncData, sync, index}: TreeDiagramI) {

    useEffect(() => {
        if(!sync) return
        console.log('syncing data ' + index)
        const uploadData = async () => {
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/updatetest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: data._id
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

    const tableCellItemCount = useRef<number>(0)
    tableCellItemCount.current = 0

    const [tableData, setTableData] = useState<RowI>(fakeData) // change to data
    //const [tableDataCopy, setTableDataCopy] = useState(tableData)
    const [minWidth, setMinWidth] = useState(0)

    useMemo(() => {
        //setTableDataCopy({...tableData})
    }, [tableData])

    useEffect(() => {
        console.log('setting min width')
        const newMinWidth = tableCellItemCount.current * 150
        setMinWidth(newMinWidth)
    }, [tableData])

    const classes = useStyles()

    const changeTableDataName = (e:any, nav:any) => {
        const tableDataCopy = {...tableData}
        let path = tableDataCopy
        nav.forEach((num:number) => path = path.children[num])
        path.name = e.target.value
        setTableData(tableDataCopy)
    }

    const changeTableDataNumber = (e:any, nav:any) => {
        const tableDataCopy = {...tableData}
        let path = tableDataCopy
        nav.forEach((num:number) => path = path.children[num])
        path.probability = Number('0.' + e.target.value)
        setTableData(tableDataCopy)
    }

    const newRow = (row:RowI, currentProbability:number, nav:any) => {
        return (
            <Grid item key={row.toString() + nav} className={`${classes.parentCell} ${classes.whiteBorder}`}>
                <Grid item container justify="center"  style={{position: 'relative', flexGrow: !row.children ? 1 : 0}}
                className={`${nav ? classes.sideBorder : ''}`} >
                    <Grid item>
                        <Box my={2}>
                            {/* <Typography variant="h6" style={{color: '#fff'}}>{row.name}</Typography> */}
                            <Box mb={2} style={{textAlign: 'center'}}>
                                <TextField label="Outcome" value={row.name} size="small" variant="outlined"
                                className={classes.nameInput} InputProps={{className: classes.textWhite}}
                                InputLabelProps={{className: classes.dimWhite}} onChange={(e) => changeTableDataName(e, nav)} />
                            </Box>
                            {nav && <Box mb={2} style={{textAlign: 'center'}}>
                                <TextField label="Probability" value={row.probability.toString().substring(2)} size="small" variant="outlined"
                                className={classes.nameInput} InputProps={{className: classes.textWhite, 
                                    startAdornment: <InputAdornment disableTypography style={{color: '#fff'}} position="start">0.</InputAdornment>}}
                                InputLabelProps={{className: classes.dimWhite}} onChange={(e) => changeTableDataNumber(e, nav)} />
                            </Box>}
                            {!row.children && <Box style={{textAlign: 'center'}}>
                                <Typography variant="subtitle2" className={classes.dimWhite}>Outcome Probability</Typography>
                                <Typography variant="subtitle1" className={classes.textSuccess}>{currentProbability}</Typography>
                            </Box>}
                        </Box>
                    </Grid>
                </Grid>
                {row.children ? <Grid item container wrap="nowrap" style={{display: 'flex', flexGrow: 1}}>
                    {row.children.map((child, index) => {
                        if(!child.children) {
                            tableCellItemCount.current += 1
                        }
                        return newRow(child, currentProbability * child.probability, nav ? [...nav, index] : [index])
                    })}
                </Grid> : ''}
            </Grid>
        )
    }

    console.log(minWidth)

    return (
            <Grid container style={{minWidth: minWidth}}>
                <Paper style={{backgroundColor: 'hsl(241, 82%, 50%)'}}>
                    {newRow(tableData, 1, null)}
                </Paper>
            </Grid>
    )
}