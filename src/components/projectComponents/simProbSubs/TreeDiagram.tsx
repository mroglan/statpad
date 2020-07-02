import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {ITreeDiagram, SyncData} from '../projectInterfaces'

const useStyles = makeStyles(theme => ({
    parentCell: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column'
    },
    whiteBorder: {
        '&:hover > div > div > div > div > button': {
            opacity: 1
        }
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
    },
    branchButton: {
        color: 'rgba(255, 255, 255, .7) ',
        fontSize: '.7rem',
        opacity: 0,
        position: 'absolute',
        left: '50%',
        zIndex: 12,
        padding: 0,
        '&:hover': {
            color: '#fff'
        },
    },
    addButton: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)',
        },
        transform: 'translateX(-105%) translateY(-50%)',
    },
    removeButton: {
        backgroundColor: 'hsla(348, 91%, 40%, 1)',
        '&:hover': {
            backgroundColor: 'hsla(348, 91%, 40%, .9)'
        },
        transform: 'translateX(5%) translateY(-50%)',
    }
}))

interface TreeDiagramI {
    data: ITreeDiagram;
    syncData: SyncData;
    sync:boolean;
    index:number;
}

interface RowI {
    name: string;
    probability: string;
    children?: RowI[];
}

const fakeData = {
    name: 'name 1',
    probability: 1,
    children: [
        {name: 'name 2', probability: .5, children: [
            {name: 'name 3', probability: .2, children: []},
            {name: 'name 3.5', probability: .8, children: [
                {name: 'name 4',probability: .5,children:[]}, {name: 'name 5', probability: .5,children:[]},// {name: 'name 6', probability: '1'}, {name: 'name 6', probability: '1'}
            ]}
        ]},
        {name: 'name 2.5', probability: .5, children: [
            {name: 'name 3', probability: .2, children: []},
            {name: 'name 3.5', probability: .8, children: [
                {name: 'name 4',probability: .5,children:[]}, {name: 'name 5', probability: .5,children:[]}
            ]}
        ]}
    ]
}

export default function TreeDiagram({data, syncData, sync, index}: TreeDiagramI) {

    useEffect(() => {
        if(!sync) return
        //console.log('syncing data ' + index)
        const uploadData = async () => {
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/updatetest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: data._id,
                    data: tableData,
                    properties: 0
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

    const [tableData, setTableData] = useState<RowI>(data.data) 
    const [minWidth, setMinWidth] = useState(0)

    useEffect(() => {
        console.log('setting min width')
        const newMinWidth = tableCellItemCount.current * 150
        setMinWidth(newMinWidth)
    }, [tableData])

    const classes = useStyles()

    const changeTableDataName = (e:any, nav:any) => {
        const tableDataCopy = {...tableData}
        let path = tableDataCopy
        if(!nav) {
            tableDataCopy.name = e.target.value
            setTableData(tableDataCopy)
            return
        }
        nav.forEach((num:number) => path = path.children[num])
        path.name = e.target.value
        setTableData(tableDataCopy)
    }

    const changeTableDataNumber = (e:any, nav:any) => {
        const tableDataCopy = {...tableData}
        let path = tableDataCopy
        if(!nav) {
            tableDataCopy.probability = '0.' + e.target.value
            setTableData(tableDataCopy)
            return
        }
        nav.forEach((num:number) => path = path.children[num])
        path.probability = '0.' + e.target.value
        setTableData(tableDataCopy)
    }

    const addBranch = (nav:any) => {
        const tableDataCopy = {...tableData}
        let path = tableDataCopy
        if(!nav) {
            tableDataCopy.children.push({
                name: '',
                probability: '0.5',
                children: []
            })
            setTableData(tableDataCopy)
            return
        }
        nav.forEach((num:number) => path = path.children[num])
        path.children.push({
            name: '',
            probability: '0.5',
            children: []
        })
        setTableData(tableDataCopy)
    }

    const deleteBranch = (nav:any) => {
        const tableDataCopy = {...tableData}
        let path = tableDataCopy
        nav.forEach((num:number, index:number) => {
            return index + 1 < nav.length ? path = path.children[num] : ''
        })
        path.children.splice(nav[nav.length - 1], 1)
        setTableData(tableDataCopy)
    }

    const newRow = (row:RowI, currentProbability:number, nav:any) => {
        return (
            <Grid item key={row.toString() + nav} className={`${classes.parentCell} ${classes.whiteBorder}`}>
                <Grid item container justify="center"  style={{position: 'relative', flexGrow: row.children.length === 0 ? 1 : 0}}
                className={`${nav ? classes.sideBorder : ''}`} >
                    <Grid item>
                        <Box my={2}>
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
                            {row.children.length === 0 && <Box style={{textAlign: 'center'}}>
                                <Typography variant="subtitle2" className={classes.dimWhite}>Outcome Probability</Typography>
                                <Typography variant="subtitle1" className={classes.textSuccess}>{currentProbability}</Typography>
                            </Box>}
                            <Box style={{position: 'relative'}}>
                                <IconButton className={`${classes.branchButton} ${classes.addButton}`} 
                                style={!nav ? {transform: 'translateX(-50%) translateY(-50%)'} : {}} 
                                onClick={(e) => addBranch(nav)} >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                                {nav && <IconButton className={`${classes.branchButton} ${classes.removeButton}`}
                                onClick={(e) => deleteBranch(nav)} >
                                    <RemoveIcon fontSize="small" />
                                </IconButton>}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                {row.children.length > 0 ? <Grid item container wrap="nowrap" style={{display: 'flex', flexGrow: 1}}>
                    {row.children.map((child, index) => {
                        if(child.children.length === 0) {
                            tableCellItemCount.current += 1
                        }
                        return newRow(child, Number(currentProbability) * Number(child.probability), nav ? [...nav, index] : [index])
                    })}
                </Grid> : ''}
            </Grid>
        )
    }

    console.log(minWidth)

    return (
            <Grid container justify="center" style={{minWidth: minWidth}}>
                <Paper elevation={0} style={{backgroundColor: 'hsl(241, 82%, 50%)'}}>
                    {newRow(tableData, 1, null)}
                </Paper>
            </Grid>
    )
}