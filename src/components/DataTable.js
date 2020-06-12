import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {useState, useEffect, createRef, useRef} from 'react'
import { Input, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {Grid, Typography, Paper, Button, Box, Select, InputLabel, MenuItem} from '@material-ui/core'
import Header from './Header'
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab'
import FormControl from '@material-ui/core/FormControl'
import Graph from './Graph'
import SyncIcon from '@material-ui/icons/Sync';
import IconButton from '@material-ui/core/IconButton'
import {makeStyles} from '@material-ui/core/styles'

// interface DataTableProps {
//     syncData: any;
// }

// interface CellKeyPress {
//     total: number;
//     index: number;
// }

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        paddingBottom: '3rem',
        paddingRight: '2rem',
        paddingLeft: '2rem'
    },
    table: {
        border: 'none',
        '& td': {
            padding: '0 1rem'
        }
    },
    tableHead: {
        color: theme.palette.primary.light,
        textAlign: 'center',
        paddingBottom: 0,
    },
    inputBase: {
        backgroundColor: 'inherit',
        borderBottom: '1px solid hsl(241, 82%, 40%)',
        borderRadius: '.1rem',
        padding: '.3rem .5rem',
        color: 'white',
        '&:hover, &:focus': {
            border: 'none'
        },
        '& input': {
            textAlign: 'center'
        }
    },
    headInput: {
        '& input': {
            textAlign: 'center',
            color: 'white'
        }
    },
    tableRow: {
        border: 'none',
        transform: 'scale(1)',
        '& td': {
            borderBottom: 'none'
        }
    },
    leftBorder: {
        borderLeft: '1px solid white'
    },
    rightBorder: {
        borderRight: '1px solid white'
    },
    alignCenter: {
        textAlign: 'center'
    },
    deleteRowBtn: {
        position: 'absolute',
        left: '-2rem',
        top: 0,
        opacity: .5,
        color: theme.palette.error.dark,
        transitionProperty: 'opacity, background, transform',
        '&:hover': {
            opacity: 1,
            background: 'none',
            transform: 'scale(1.1)'
        }
    },
    deleteColumnBtn: {
        position: 'absolute',
        left: '50%',
        bottom: '-3rem',
        transform: 'translateX(-50%)',
        opacity: .5,
        color: theme.palette.error.dark,
        transitionProperty: 'opacity, background, transform',
        '&:hover': {
            opacity: 1,
            background: 'none',
            transform: 'scale(1.1), translateX(-50%)'
        }
    },
    paperBG: {
        backgroundColor: 'hsl(241, 82%, 50%)',
        position: 'relative'
    },
    addColBtn: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateX(50%) translateY(-50%)',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
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
    dataColor: {
        color: 'hsl(241, 82%, 90%)'
    },
    '@keyframes appear': {
        '0%': {
            opacity: 0,
            transform: 'scale(0)',
            transformOrigin: 'center left'
        },
        '100%': {
            opacity: 1,
            transform: 'scale(1)',
        }
    },
    animateAppear: {
        animation: `$appear 200ms ease-in`,
    }
}))

export default function DataTable({syncData}) {

    // const [cellRefs, setCellRefs] = useState([
    //     [createRef(), createRef()], [createRef(), createRef()], [createRef(), createRef()],
    //      [createRef(), createRef()], [createRef(), createRef()], [createRef(), createRef()]
    // ])

    const [cells, setCells] = useState([
        ['', ''], ['', ''], ['', ''],
         ['', ''], ['', ''], ['', '']
    ])

    const cellRefs = cells.map(cell => cell.map(el => createRef()))
    //console.log(cellRefs)

    //const [rowAdded, setRowAdded] = useState(false)

    const prevCells = useRef()

    useEffect(() => {
        // console.log(cellRefs)
        // if(rowAdded) cellRefs[cellRefs.length - 1][0].current.focus()
        // else {
        //     console.log('processing data')
        //     processData()
        // } 
        //setRowAdded(!rowAdded)
        console.log(prevCells)
        // console.log(cellRefs)
        let copy = []
        for(let i = 0; i < cells.length; i++) {
            let miniArray = []
            for(let j = 0; j < cells[i].length; j++) {
                miniArray.push(1)
            }
            copy.push(miniArray)
        }
        if(!prevCells || !prevCells.current) {
            prevCells.current = copy
            return
        }
        if(prevCells.current.length < cells.length) {
            cellRefs[cellRefs.length - 1][0].current.focus()
        } else if(prevCells.current[0].length !== cells[0].length) {
            console.log('going to process data...')
            processData()
        }
        prevCells.current = copy
    }, [cells])

    const handleCols = () => {
        const newRows = cells.map(row => {
            row.push('')
            return row
        })
        //processData()
        //setRowAdded(false)
        setCells(newRows)
    }

    const handleRows = (newRows) => {
        //console.log(newRows)
        setCells(newRows)
        //setRowAdded(true)
    }

    const addNewRow = (total) => {
        console.log('adding new row')
        let newRowArray = [[]]
        for(let i = 0; i < cells[0].length; i++) {
            newRowArray[0].push('')
        }
        const newRows = [...cells, ...newRowArray]
        handleRows(newRows)
        //cellRefs[total][0].current.focus()
        //console.log(rows)
    }

    const handleKeyPress = (e, rowIndex, cellIndex) => {
        console.log(e.target.value)
        const cellsCopy = [...cells]
        cellsCopy[rowIndex][cellIndex] = e.target.value
        setCells(cellsCopy)
    }

    const handleDataKeyDown = (e, {total: rowTotal, index: rowIndex}, {total: rowsTotal, index: rowsIndex}) => {
        if(e.keyCode === 8) {
            //console.log(e.target.value)
            if(e.target.value.length !== 0) return
            if(rowsIndex === 0 && rowIndex === 0) return
            if(rowIndex === 0) {
                cellRefs[rowsIndex - 1][rowTotal - 1].current.focus()
                return
            }
            cellRefs[rowsIndex][rowIndex - 1].current.focus()
            return
        }
        if(e.keyCode !== 13) return
        if(rowTotal === rowIndex + 1 && rowsTotal === rowsIndex + 1) {
            addNewRow(rowsTotal)
            return
        }
        if(rowIndex + 1 < rowTotal) {
            cellRefs[rowsIndex][rowIndex + 1].current.focus()
            return
        }
        cellRefs[rowsIndex + 1][0].current.focus()
    }

    const handleDeleteRow = (index) => {
        const newRows = [...cells]
        newRows.splice(index, 1)
        //setRowAdded(false)
        setCells(newRows)
    }

    const handleDeleteColumn = (index) => {
        const newRows = cells.map((row) => {
            row.splice(index, 1)
            return row
        })
        //setRowAdded(false)
        setCells(newRows)
    }

    const processData = () => {
        // const data = cellRefs.map(ref => {
        //     const returnArray = ref.map(cell => {
        //         return cell ? cell.current.value : null
        //     })
        //     return returnArray
        // })
        syncData(cells)
    }

    const classes = useStyles()
    //console.log('Row length: ' + rows.length)
    //console.log('Cell Ref: ', cellRefs)
    //console.log('Row length: ', rowLength)
    return (
        <Paper elevation={3} className={classes.paperBG}>
            <div style={{position: 'absolute'}}>
                <IconButton className={classes.syncButton} aria-label="sync data" onClick={(e) => processData()}>
                    <SyncIcon />
                </IconButton>
            </div>
            <Typography className={classes.dataColor} variant="h5" display="block" align="center">
                Data
            </Typography>
            <TableContainer className={classes.tableContainer}>
                <Table className={classes.table}>
                    {/* <colgroup>
                        {cellRefs[0].map((ref, index) => (
                            <col key={'col ' + index} className={`${classes.animateAppear}`} />
                        ))}
                    </colgroup> */}
                    <TableHead>
                        <TableRow className={classes.tableRow}>
                                {cells[0].map((cell, i) => (
                                    <TableCell className={`${classes.tableHead} ${classes.animateAppear}`} key={0 + ' ' + i.toString()}>
                                        <TextField type="text" placeholder={'Title'} inputRef={cellRefs[0][i]} className={classes.headInput} InputProps={{ disableUnderline: true }} 
                                        onKeyDown={(e) => handleDataKeyDown(e, {total: cellRefs[0].length, index: i}, {total: cellRefs.length, index: 0})} 
                                        value={cell} onChange={(e) => handleKeyPress(e, 0, i)} />
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cells.map((row, i) => {
                            if(i === 0) return
                            return (
                            <TableRow key={i.toString()} className={`${classes.tableRow}`}>
                            {row.map((cell, index) => (
                                <TableCell key={i.toString() + ' ' +  index.toString()}
                                className={`${index > 0 ? classes.leftBorder : ''} ${index + 1 !== row.length ? classes.rightBorder : ''} ${classes.alignCenter} ${classes.animateAppear}`}>
                                    {index === 0 && <IconButton disableRipple aria-label="delete row" className={classes.deleteRowBtn} onClick={(e) => handleDeleteRow(i)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>}
                                    <div style={{position:'relative'}}>
                                        <Input type="text" inputRef={cellRefs[i][index]} id={i.toString() + ' ' +  index.toString()}
                                        onKeyDown={(e) => handleDataKeyDown(e, {total: row.length, index: index}, {total: cellRefs.length, index: i})} className={classes.inputBase}
                                        value={cell} onChange={(e) => handleKeyPress(e, i, index)}  />
                                        {i + 1 === cellRefs.length && index > 1 && <IconButton disableRipple aria-label="delete column" className={classes.deleteColumnBtn} onClick={(e) => handleDeleteColumn(index)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                        }
                                    </div>
                                </TableCell>
                            ))}
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </TableContainer>
            {cellRefs[0].length < 6 && <Fab className={`${classes.addColBtn} ${classes.addBtn}`} color="inherit" size="small"
            onClick={(e) => handleCols()}  >
                <AddIcon />
            </Fab>}
            <Fab className={`${classes.addRowBtn} ${classes.addBtn}`} color="inherit" size="small" 
            onClick={(e) => {
                let newRowArray = [[]]
                for(let i = 0; i < cells[0].length; i++) {
                    newRowArray[0].push('')
                }
                //setRowAdded(false)
                handleRows([...cells, ...newRowArray])
                }} >
                <AddIcon />
            </Fab>
        </Paper>
    )
}