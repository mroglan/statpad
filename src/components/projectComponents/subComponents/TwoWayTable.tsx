import {useState, useEffect, useRef, createRef, useMemo} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton, InputBase} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

interface TableI {
    component:any;
    syncData:any;
    sync:boolean;
    index:number;
}

const useStyles = makeStyles(theme => ({
    textWhite: {
        color: '#fff'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .5)'
    },
    textSuccess: {
        color: theme.palette.success.main
    },
    textCenter: {
        textAlign: 'center'
    },
    table: {
        border: 'none',
        '& td': {
            borderCollapse: 'collapse',
            backgroundClip: 'padding-box',
            mozBackgroundClip: 'padding-box',
            webkitBackgroundClip: 'padding-box'
        }
    },
    tableRow: {
        border: 'none',
        transform: 'scale(1)'
    },
    contentTitle: {
        color: '#fff',
        '& input': {
            fontSize: '1.3rem',
            textAlign: 'center'
        }
    },
    contentTitleSm: {
        color: '#fff',
        '& input': {
            fontSize: '1rem',
            textAlign: 'center'
        }
    },
    contentInput: {
        color: 'rgba(255, 255, 255, .7)',
        width: '100%',
        '& input': {
            textAlign: 'center',
            fontSize: '1.3rem'
        }
    },
    contentInputSm: {
        color: 'rgba(255, 255, 255, .7)',
        width: '100%',
        '& input': {
            textAlign: 'center',
            fontSize: '1rem'
        }
    },
    contentTitleCell: {
        border: '1px solid #fff',
        backgroundColor: 'hsl(241, 82%, 46%)',
        position: 'relative'
    },
    contentInputCell: {
        border: '1px solid rgba(255, 255, 255, .7)',
        position: 'relative'
    },
    addColBtn: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: 'rgba(255, 255, 255, .7) ',
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        borderRadius: '20%',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)',
            color: 'rgba(255, 255, 255, 1) '
        },
    },
    addRowBtn: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: 'rgba(255, 255, 255, .7) ',
        right: '50%',
        bottom: 0,
        position: 'absolute',
        transform: 'translateX(50%)',
        borderRadius: '20%',
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)',
            color: 'rgba(255, 255, 255, 1) '
        },
    },
    positionRelative: {
        position: 'relative'
    },
    deleteBtn: {
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

const fakeData = [
    [null, 'col 1', 'col 2'],
    ['row 1', '5', '9'],
    ['row 2', '8', '13']
]

export default function TwoWayTable({component, syncData, sync, index}:TableI) {
    
    useEffect(() => {
        if(!sync) return
        const uploadData = async () => {
            const res = await fetch(`${process.env.API_ROUTE}/projects/components/updatetest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: component._id,
                    //data: tableData,
                    //properties: tableProperties
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

    const [tableData, setTableData] = useState<string[][]>(fakeData) // change to component.data
    //const [minWidth, setMinWidth] = useState(0)
    // minWidth = #columns * 150

    const changeCellValue = (e:any, rowNum:number, cellNum:number) => {
        const dataCopy = [...tableData]
        dataCopy[rowNum][cellNum] = e.target.value
        setTableData(dataCopy)
    }

    const inputClasses = (rowNum:number, cellNum:number) => {
        if(rowNum === 0 || cellNum === 0) {
            return tableData[0].length > 3 && tableData[rowNum][cellNum].length > 10 ? `${classes.contentTitleSm}` : `${classes.contentTitle}`
        } else {
            return tableData[0].length > 3 && tableData[rowNum][cellNum].length > 10 ? `${classes.contentInputSm}` : `${classes.contentInput}`
        }
    }

    const tableCellClasses = (rowNum:number, cellNum:number) => {
        if(rowNum === 0 && cellNum === 0) return `${classes.positionRelative}`
        if(rowNum === 0 || cellNum === 0) {
            return `${classes.contentTitleCell}`
        } else {
            return `${classes.contentInputCell}`
        }
    }

    const addCol = () => {
        const dataCopy = [...tableData]
        dataCopy.forEach((row) => row.push(''))
        setTableData(dataCopy)
    }

    const addRow = () => {
        const dataCopy = [...tableData]
        const newRow = dataCopy[0].map(cell => '')
        setTableData([...dataCopy, newRow])
    }

    const deleteCol = (cellNum:number) => {
        const dataCopy = [...tableData]
        dataCopy.forEach((row) => row.splice(cellNum, 1))
        setTableData(dataCopy)
    }

    const deleteRow = (rowNum:number) => {
        const dataCopy = [...tableData]
        dataCopy.splice(rowNum, 1)
        setTableData(dataCopy)
    }

    const classes = useStyles()
    const minWidth = tableData[0].length * 200
    return (
        <Grid container justify="center" style={{minWidth: minWidth}}>
            <Paper elevation={0} style={{backgroundColor: 'hsl(241, 82%, 50%)'}}>
                <TableContainer>
                    <Table className={classes.table}>
                        <TableBody>
                            {tableData.map((row:string[], rowNum:number) => (
                                <TableRow key={rowNum} className={`${classes.tableRow}`}>
                                    {row.map((cell:string, cellNum:number) => (
                                        <TableCell key={cellNum} className={`${tableCellClasses(rowNum, cellNum)}`} >
                                            {cell !== null ? <>
                                                <InputBase value={cell} onChange={(e) => changeCellValue(e, rowNum, cellNum)}
                                                inputProps={{'aria-label': 'Table Input'}} 
                                                className={`${classes.textCenter} ${inputClasses(rowNum, cellNum)}`} /> 
                                                {rowNum === 0 && <IconButton size="small" className={classes.deleteBtn}
                                                onClick={(e) => deleteCol(cellNum)} >
                                                    <DeleteOutlineIcon />
                                                </IconButton>}
                                                {cellNum === 0 && <IconButton size="small" className={classes.deleteBtn}
                                                onClick={(e) => deleteRow(rowNum)} >
                                                    <DeleteOutlineIcon />
                                                </IconButton>}
                                            </> : 
                                            <>
                                                <IconButton size="small" className={classes.addColBtn}
                                                onClick={(e) => addCol()} >
                                                    <AddIcon />
                                                </IconButton>
                                                <IconButton size="small" className={classes.addRowBtn}
                                                onClick={(e) => addRow()} >
                                                    <AddIcon />
                                                </IconButton>
                                            </>
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Grid>
    )
}