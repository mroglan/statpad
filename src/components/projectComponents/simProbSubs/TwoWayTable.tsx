import {useState, useEffect, useRef, createRef, useMemo, Fragment} from 'react'
import {Grid, Typography, Box, TextField, InputAdornment, Paper, IconButton, InputBase, Switch, 
    FormControlLabel, Select, FormControl, MenuItem} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
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
        fontSize: '1.3rem',
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
        fontSize: '1.3rem',
        width: '100%',
        '& input': {
            textAlign: 'center',
            fontSize: '1.3rem'
        }
    },
    contentInputSm: {
        color: 'rgba(255, 255, 255, .7)',
        width: '100%',
        fontSize: '1.3rem',
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
    },
    scrollX: {
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
            width: 10
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'hsl(241, 82%, 60%)',
            borderRadius: '.3rem',
            '&:hover': {
                background: 'hsl(241, 82%, 57%)'
            }
        }
    },
    verticalTitleLabel: {
        position: 'absolute',
        left: 0,
        bottom: '0%',
        transform: ' rotate(270deg)',
        transformOrigin: '0 0'
    },
    formControl: {
        '& > div': {
            border: '1px solid hsl(241, 82%, 90%)',
            borderRadius: '1rem'
        }
    }
}))

const fakeData = [
    [null, 'col 1', 'col 2'],
    ['row 1', '5', '9'],
    ['row 2', '8', '13']
]

const fakeProperties = {
    horzTitle: '',
    verticalTitle: '',
    displayTotals: false,
    // displayRelativeProb: false,
    // displayConditionalProbHorz: false,
    // displayConditionalProbVertical: false,
    contentType: 'frequency'
}

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
                    data: tableData,
                    properties: tableProperties
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

    const frequencyTotal = useRef<number>()

    const [tableData, setTableData] = useState<string[][]>(component.data) // change to component.data
    const [tableProperties, setTableProperties] = useState(component.properties) // change to component.properties

    useMemo(() => {
        frequencyTotal.current = tableData.reduce((total:number, row:string[], rowNum:number) => {
            if(rowNum === 0) return total
            return total += row.reduce((rowTotal:number, cell:string, cellNum:number) => cellNum === 0 ? rowTotal : rowTotal += Number(cell), 0)
        }, 0)
        //console.log(frequencyTotal.current)
    }, [tableData])

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

    const changeHorzTitle = (e:any) => {
        const propertyCopy = {...tableProperties}
        propertyCopy.horzTitle = e.target.value
        setTableProperties(propertyCopy)
    }

    const changeVerticalTitle = (e:any) => {
        const propertyCopy = {...tableProperties}
        propertyCopy.verticalTitle = e.target.value
        setTableProperties(propertyCopy)
    }

    const TotalsSwitch = withStyles((theme) => ({
        root: {
            width: 42,
            height: 26,
            padding: 0,
            margin: theme.spacing(1),
          },
          switchBase: {
            padding: 1,
            '&$checked': {
              transform: 'translateX(16px)',
              color: theme.palette.common.white,
              '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none',
              },
            },
            '&$thumb': {
              color: '#52d869',
              border: '6px solid #fff',
            },
          },
          thumb: {
            width: 24,
            height: 24,
          },
          track: {
            borderRadius: 26 / 2,
            border: `1px solid ${theme.palette.grey[400]}`,
            backgroundColor: theme.palette.grey[400],
            opacity: 1,
            transition: theme.transitions.create(['background-color', 'border']),
          },
          checked: {},
    }))(Switch)

    const cellInput = (cell:string, rowNum:number, cellNum:number) => {
        if(tableProperties.contentType === 'frequency') {
            return (
                <InputBase value={cell} onChange={(e) => changeCellValue(e, rowNum, cellNum)}
                inputProps={{'aria-label': 'Table Input'}} 
                className={`${classes.textCenter} ${inputClasses(rowNum, cellNum)}`} />
            )
        } if(tableProperties.contentType === 'relative') {
            return (
                <InputBase value={rowNum !== 0 && cellNum !== 0 ? (Number(cell) / frequencyTotal.current).toFixed(4) : cell} 
                disabled={rowNum !== 0 && cellNum !== 0} className={`${classes.textCenter} ${inputClasses(rowNum, cellNum)}`}
                classes={{disabled: `${inputClasses(rowNum, cellNum)}`}} />
            )
        }
    }

    const totalValue = (val:string, rowNum:number, cellNum:number) => {
        if(tableProperties.contentType === 'frequency') return val
        if(tableProperties.contentType === 'relative') return rowNum !== 0 && cellNum !== 0 ? (Number(val) / frequencyTotal.current).toFixed(4) : val
    }

    const totalsRow = (rowNum:number) => {
        if(rowNum !== tableData.length - 1) return
        const totalsArray:string[] = tableData[0].map((cell:string, cellNum:number) => {
            if(cellNum === 0) return 'Totals'
            const total = tableData.reduce((currentTotal:number, row:string[], rowIndex:number) => {
                if(rowIndex === 0) return currentTotal
                return currentTotal += Number(row[cellNum])
            }, 0)
            return total.toString()
        })
        totalsArray.push(totalsArray.reduce((currentTotal:number, val:string, index:number) => index === 0 ? currentTotal : currentTotal += Number(val), 0).toString())
        return <TableRow className={classes.tableRow}>
            {totalsArray.map((val:string, index:number) => <TableCell key={index} className={index === 0 ? classes.contentTitleCell : classes.contentInputCell}>
                <Typography variant="body1" style={{textAlign: 'center'}} className={index === 0 ? classes.contentTitle : classes.contentInput}>
                    {totalValue(val, tableData.length, index)}
                </Typography>
            </TableCell>)}
        </TableRow>
    }

    const totalsCellHorz = (rowNum:number, cellNum:number) => {
        if(cellNum === tableData[0].length - 1 && rowNum !== 0) return <TableCell className={classes.contentInputCell}>
            <Typography variant="body1" style={{textAlign: 'center'}} className={classes.contentInput} >
                {totalValue(tableData[rowNum].reduce((total:number, cell:string, i:number) => i !== 0 ? total += Number(cell) : total, 0).toString(), rowNum, cellNum)}
            </Typography>
        </TableCell>
        if(cellNum === tableData[0].length - 1 && rowNum === 0) return <TableCell className={classes.contentTitleCell}>
            <Typography variant="body1" style={{textAlign: 'center'}} className={classes.contentTitle}>
                Totals
            </Typography>
        </TableCell>
     }

    const classes = useStyles()
    const minWidth = tableData[0].length * 200
    return (
        <Box>
            <Box>
                <Typography variant="h6" style={{textAlign: 'center'}} className={classes.textWhite}>
                    {tableProperties.horzTitle}
                </Typography>
            </Box>
            <Box pl={4} style={{position: 'relative'}} className={`${classes.scrollX}`}>
                <Box className={classes.verticalTitleLabel}>
                    <Typography variant="h6" className={classes.textWhite}>
                        {tableProperties.verticalTitle}
                    </Typography>
                </Box>
                <Grid container justify="center" style={{minWidth: minWidth}}>
                    <Paper elevation={0} style={{backgroundColor: 'hsl(241, 82%, 50%)'}}>
                        <TableContainer>
                            <Table className={classes.table}>
                                <TableBody>
                                    {tableData.map((row:string[], rowNum:number) => (
                                        <Fragment key={rowNum}>
                                            <TableRow className={`${classes.tableRow}`}>
                                                {row.map((cell:string, cellNum:number) => (
                                                    <Fragment key={cellNum}>
                                                        <TableCell className={`${tableCellClasses(rowNum, cellNum)}`} >
                                                            {cell !== null ? <>
                                                                {cellInput(cell, rowNum, cellNum)}
                                                                {rowNum === 0 && <IconButton size="small" disableRipple className={classes.deleteBtn}
                                                                onClick={(e) => deleteCol(cellNum)} >
                                                                    <DeleteOutlineIcon />
                                                                </IconButton>}
                                                                {cellNum === 0 && <IconButton size="small" disableRipple className={classes.deleteBtn}
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
                                                        {tableProperties.displayTotals && totalsCellHorz(rowNum, cellNum)}
                                                    </Fragment>
                                                ))}
                                            </TableRow>
                                            {tableProperties.displayTotals && totalsRow(rowNum)}
                                        </Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Box>
            <Box px={3} mt={3}>
                <Grid container spacing={5}>
                    <Grid item sm={6}>
                        <TextField label="Horizontal Title" value={tableProperties.horzTitle} fullWidth 
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}} onChange={(e) => changeHorzTitle(e)} />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField label="Vertical Title" value={tableProperties.verticalTitle} fullWidth 
                        variant="outlined" InputProps={{className: classes.textWhite}}
                        InputLabelProps={{className: classes.dimWhite}} onChange={(e) => changeVerticalTitle(e)} />
                    </Grid>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item sm={6} style={{textAlign: 'center'}}>
                        <FormControlLabel control={<TotalsSwitch 
                        onChange={(e) => setTableProperties({...tableProperties, displayTotals: !tableProperties.displayTotals})} 
                        checked={tableProperties.displayTotals} name="Show Totals" />} 
                        label="Show Totals" labelPlacement="start" classes={{label: classes.textWhite}} />
                    </Grid>
                    <Grid item sm={6} container justify="center" alignItems="center" spacing={3}>
                        <Typography variant="h6" className={classes.textWhite} id="content-type-label">
                            Displaying
                        </Typography>
                        <Box px={1}></Box>
                        <FormControl variant="filled" className={classes.formControl} hiddenLabel margin="dense">
                            <Select disableUnderline={true} 
                            value={tableProperties.contentType} onChange={(e) => setTableProperties({...tableProperties, contentType: e.target.value.toString()})}
                             aria-label="Chart Y Axis"
                            classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                <MenuItem value="frequency">Frequencies</MenuItem>
                                <MenuItem value="relative">Relaitve Probability</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}