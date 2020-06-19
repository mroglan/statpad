import { Grid, Input, Typography, Button, Box, FormControl, InputLabel, Select, MenuItem, Switch } from "@material-ui/core";
import {useState, useMemo, useEffect} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import ScatterPlot from './charts/ScatterPlot'
import BarGraph from './charts/BarGraph'
import PieChart from './charts/PieChart'
import PolarArea from './charts/PolarArea'
import BubbleChart from './charts/BubbleChart'
import ScatterOptionsDialog from './dialogs/scatterOptionsDialog'
import LineOptionsDialog from './dialogs/lineOptionsDialog'
import BarOptionsDialog from './dialogs/barOptionsDialog'
import PieOptionsDialog from './dialogs/pieOptionsDialog'
import BubbleOptionsDialog from './dialogs/bubbleOptionsDialog'
import GraphOptionsDialog from './dialogs/graphOptionsDialog'
import calcLinearRegression from '../utilities/calcLinearRegression'
import calcQuadraticRegression from '../utilities/calcQuadraticRegression'
import calcCubicRegression from '../utilities/calcCubicRegression'
import calcQuarticRegression from '../utilities/calcQuarticRegression'
import calcLnRegression from '../utilities/calcLnRegression'
import calcExpRegression from '../utilities/calcExpRegression'
import calcPowerRegression from '../utilities/calcPowerRegression'
import RegressionOptionsDialog from './dialogs/regressionOptionsDialog'
import Legend from './legends/Legend'
import RegressionEquation from './equations/RegressionEquation'
import IconButton from '@material-ui/core/IconButton'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

interface GraphProps {
    rows: any;
    basic: boolean;
    syncData: any;
    sync: boolean;
    index: number;
    initialGraph: any;
}

const useStyles = makeStyles(theme => ({
    chartTypeLabel: {
        color: 'hsl(241, 52%, 80%)'
    },
    chartSelectionContainer: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-around'
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
    formControlReg: {
        minWidth: 150
    },
    flexAlignCenter: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center'
    },
    flexAlignJustifyCenter: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textWhite: {
        color: '#fff'
    },
    titleInput: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '1.5rem',
        padding: '.5rem 0'
    },
    title: {
        border: '1px solid hsl(241, 82%, 70%)',
        borderRadius: '1rem',
        '&:hover': {
            borderColor: 'hsl(241, 82%, 90%)'
        }
    },
    extraPadding: {
        marginBottom: '2rem',
        marginTop: '1rem',
    },
    graphOptionsContainer: {
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 3
        }
    },
    legendContainer: {
        [theme.breakpoints.up('sm')]: {
            width: '100%'
        }
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    optionsButton: {
        backgroundColor: 'hsl(241, 82%, 70%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(241, 82%, 60%)'
        }
    },
    topPadding: {
        paddingTop: theme.spacing(3)
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .5)'
    },
    lightWhite: {
        color: 'rgba(255, 255, 255, .7)'
    },
    regressionVar: {
        borderRadius: '.1rem',
        padding: '.5rem',
        '&:hover': {
            border: '1px solid rgb(208, 215, 4)'
        },
        '&:focus': {
            border: '1px solid rgb(208, 215, 4)'
        },
        outline: '0px solid'
    },
    xSpace: {
        margin: `.5rem 2rem`
    },
    darkerBg: {
        backgroundColor: 'hsl(241, 82%, 46%)'
    },
    relative: {
        position: 'relative'
    },
    removeRegressionBtn: {
        position: 'absolute',
        left: 0,
        top: '1rem',
        opacity: .5,
        color: theme.palette.error.dark,
        '&:hover': {
            background: 'none',
            opacity: 1,
            transform: 'scale(1.1)'
        }
    },
    regressionContainer: {
        animation: `$appear 600ms ease-in`
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
    }
}))

export default function Graph({rows, basic, syncData, index, sync, initialGraph}: GraphProps) {

    //console.log('sync', sync)

    useEffect(() => {
        //console.log(sync)
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
                    properties: graphProperties,
                    charts: chartProperties
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

    const [chartProperties, setChartProperties] = useState(!basic ? initialGraph.charts : [{
        type: 'scatter',
        label: null,
        regressionType: null,
        regressionInfo: {
            a: null,
            b: null,
            r: null,
            r2: null
        },
        x: {
            num: 0
        },
        y: {
            num: 1
        },
        z: {
            num: 1
        },
        options: {
            points: {
                color: '#E30F0F',
                radius: 3,
                maxRadius: 20
            },
            line: {
                color: '#2ea71b',
                width: 3,
                tension: 0.4
            },
            bar: {
                backgroundColor: '#BF3535',
                borderColor: '#E81515',
                borderWidth: 1
            }
        }
    }])
    //const [regressions, setRegressions] = useState([])

    const [optionsSwitch, setOptionsSwitch] = useState([false, false])

    const [graphProperties, setGraphProperties] = useState(!basic ? initialGraph.properties : {
        axis: {
            titles: {
                color: '#fff'
            },
            ticks: {
                xMin: null,
                xMax: null,
                xScl: null,
                yMin: null,
                yMax: null,
                yScl: null
            }
        },
        graphTitle: {
            color: '#fff',
            title: null
        },
        legend: {
            display: false
        }
    })

    const createRegression = (type:string, rows, xNum:number,  yNum:number) => {
        switch (type) {
            case 'linear':
                return calcLinearRegression(rows, xNum, yNum)
            case 'quadratic':
                return calcQuadraticRegression(rows, xNum, yNum)
            case 'cubic': 
                return calcCubicRegression(rows, xNum, yNum)
            case 'quartic': 
                return calcQuarticRegression(rows, xNum, yNum)
            case 'ln':
                return calcLnRegression(rows, xNum, yNum)
            case 'exponential':
                return calcExpRegression(rows, xNum, yNum)
            case 'power':
                return calcPowerRegression(rows, xNum, yNum)
        }
    }

    useMemo(() => {
        const reloadChart = () => {
            //console.log('reloading...')
            const chartPropertiesCopy = [...chartProperties]
            chartPropertiesCopy.forEach((property:any, index:number) => {
                if(index === 0 || property.type !== 'regression') return
                property.regressionInfo = createRegression(property.regressionType, [...rows], chartPropertiesCopy[0].x.num, chartPropertiesCopy[0].y.num)
            })
            setChartProperties(chartPropertiesCopy)
        }
        reloadChart()  
    }, [rows])

    const handleGraphPropertiesChange = (newGraphProperties:any) => {
        setGraphProperties(newGraphProperties)
    }

    const handleChartTypeChange = (e:any, index:number) => {
        const chartPropertiesCopy = [...chartProperties]
        chartPropertiesCopy[index].type = e.target.value
        setChartProperties(chartPropertiesCopy)
    }

    const handleRegressionTypeChange = (e:any, index:number) => {
        const chartPropertiesCopy:any = [...chartProperties]
        chartPropertiesCopy[index].regressionType = e.target.value
        chartPropertiesCopy[index].regressionInfo = createRegression(chartPropertiesCopy[index].regressionType, [...rows],
            chartPropertiesCopy[0].x.num, chartPropertiesCopy[0].y.num )
        setChartProperties(chartPropertiesCopy)
    }

    const handleXAxisChange = (e:any, index:number) => {
        const chartPropertiesCopy = [...chartProperties]
        chartPropertiesCopy[index].x.num = e.target.value
        chartPropertiesCopy.forEach((property:any, i:number) => {
            if(i === 0) return
            if(property.type === 'regression') {
                property.regressionInfo = createRegression(property.regressionType, [...rows], chartPropertiesCopy[0].x.num, chartPropertiesCopy[0].y.num)
            }
        })
        setChartProperties(chartPropertiesCopy)
    }

    const handleYAxisChange = (e:any, index:number) => {
        const chartPropertiesCopy = [...chartProperties]
        chartPropertiesCopy[index].y.num = e.target.value
        chartPropertiesCopy.forEach((property:any, i:number) => {
            if(i === 0) return
            if(property.type === 'regression') {
                property.regressionInfo = createRegression(property.regressionType, [...rows], chartPropertiesCopy[0].x.num, chartPropertiesCopy[0].y.num)
            }
        })
        setChartProperties(chartPropertiesCopy)
    }

    const handleZAxisChange = (e:any, index:number) => {
        console.log(e.target.value)
        const chartPropertiesCopy = [...chartProperties]
        chartPropertiesCopy[index].z.num = e.target.value
        setChartProperties(chartPropertiesCopy)
    }

    const handleTitleChange = (e:any) => {
        const graphPropertiesCopy = {...graphProperties}
        graphPropertiesCopy.graphTitle.title = e.target.value
        setGraphProperties(graphPropertiesCopy)
    }

    const handlePropertyChange = (newProperties:any, index:number) => {
        const chartPropertiesCopy = [...chartProperties]
        console.log(chartPropertiesCopy[index])
        chartPropertiesCopy[index] = newProperties
        setChartProperties(chartPropertiesCopy)
    }

    const handleOptionsClose = () => {
        const newOptionsSwitch = optionsSwitch.map(option => false)
        setOptionsSwitch(newOptionsSwitch)
    }

    const toggleChartOptions = (e:any, index:number) => {
        const newOptionsSwitch = optionsSwitch.map((option, i) => i === index ? true : false)
        setOptionsSwitch(newOptionsSwitch)
    }

    const addNewRegression = () => {
        const chartPropertiesCopy:any = [...chartProperties]
        const {a, b, r, r2} = calcLinearRegression([...rows], chartProperties[0].x.num, chartProperties[0].y.num)
        chartPropertiesCopy.push({
            type: 'regression',
            label: null,
            regressionType: 'linear',
            regressionInfo: {
                a, b, r, r2
            },
            options: {
                line: {
                    color: '#2ea71b',
                    width: 3, 
                    tension: 0.4
                }
            }
        })
        const optionsSwitchCopy = [...optionsSwitch]
        optionsSwitchCopy.push(false)
        setOptionsSwitch(optionsSwitchCopy)
        setChartProperties(chartPropertiesCopy)
    }

    const removeProperty = (propertyIndex:number) => {
        const chartPropertiesCopy:any = [...chartProperties]
        chartPropertiesCopy.splice(propertyIndex, 1)
        setChartProperties(chartPropertiesCopy)
    }

    const classes = useStyles()

    const OptionsSwitch = withStyles((theme) => ({
        switchBase: {
            color: theme.palette.grey[500],
            '&$checked': {
                color: 'hsl(103, 89%, 46%)',
                '& + $track': {
                    backgroundColor: 'hsl(103, 79%, 40%)'
                }
            },
        },
        track: {},
        checked: {}
    }))(Switch)

    return (
        <Grid container>
            <Grid item sm={rows[0].length === 2 || !basic ? 12 : 9}>
                {chartProperties[0].type === 'scatter' || chartProperties[0].type === 'line' ? <ScatterPlot data={rows} properties={chartProperties} graphProperties={graphProperties} /> : ''}
                {chartProperties[0].type === 'bar' || chartProperties[0].type === 'histogram' ? <BarGraph data={rows} properties={chartProperties} graphProperties={graphProperties} /> : '' }
                {chartProperties[0].type === 'pie' && <PieChart data={rows} properties={chartProperties} graphProperties={graphProperties} /> }
                {chartProperties[0].type === 'polar' && <PolarArea data={rows} properties={chartProperties} graphProperties={graphProperties} /> }
                {chartProperties[0].type === 'bubble' && <BubbleChart data={rows} properties={chartProperties} graphProperties={graphProperties} /> }
            </Grid>
            <Grid item container md={rows[0].length === 2 ? 12 : 3} direction="row"
            justify="center" alignItems="center" spacing={3}>
                {graphProperties.legend.display && <Legend properties={chartProperties} length={rows[0].length} /> }
            </Grid>
            <Grid container item xs={12} sm={rows[0].length === 2 || !basic ? 12 : 9} className={classes.extraPadding}>
                <Grid container item sm={4} className={classes.flexAlignJustifyCenter}>
                    <Input placeholder="My Graph" inputProps={{'aria-label': 'Graph title'}} className={classes.title}
                    disableUnderline classes={{input: classes.titleInput}} onChange={(e) => handleTitleChange(e)} />
                </Grid>
                <Grid item container sm={8} direction="row" className={`${classes.graphOptionsContainer} ${classes.flexAlignCenter}`}>
                    <Box px={3}>
                        <Button variant="contained" className={`${classes.optionsButton}`}
                        onClick={(e) => toggleChartOptions(e, 0)}>
                            Graph Options
                        </Button>
                        <GraphOptionsDialog property={graphProperties} index={0} handlePropertyChange={handleGraphPropertiesChange}
                        handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} />
                    </Box>
                    {chartProperties[0].type === 'scatter' || chartProperties[0].type === 'line' || chartProperties[0].type === 'bubble' ? <Box px={3}>
                        <Button variant="contained" className={`${classes.optionsButton}`}
                        onClick={(e) => addNewRegression()} >
                            New Regression
                        </Button>
                    </Box> : ''}
                </Grid>
            </Grid>
            <Grid item xs={12} sm={rows[0].length === 2 || !basic ? 12 : 9} className={classes.chartSelectionContainer}>
                <Grid key={'chart'} xs={12} container item>
                    <Grid container item sm={3} justify="center" alignItems="center">
                        <Typography variant="h4" className={classes.textWhite}>Chart</Typography>
                    </Grid>
                    <Grid item container sm={9}>
                        <Grid item container xs={12} className={classes.chartSelectionContainer} alignItems="center">
                            <Grid item className={classes.flexAlignCenter}>
                                <FormControl variant="filled" className={classes.formControl}>
                                    <InputLabel id="plot-type-label" className={classes.chartTypeLabel}>Chart Type</InputLabel>
                                    <Select labelId="plot-type-label" id="plot-type" disableUnderline={true} 
                                    value={chartProperties[0].type} onChange={(e) => handleChartTypeChange(e, 0)} label="Chart Type"
                                    classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                        <MenuItem value="scatter">Scatter Chart</MenuItem>
                                        <MenuItem value="line">Line Chart</MenuItem>
                                        <MenuItem value="histogram">Histogram</MenuItem>
                                        <MenuItem value="bar">Bar Chart</MenuItem>
                                        <MenuItem value="pie">Pie Chart</MenuItem>
                                        <MenuItem value="polar">Polar Area Chart</MenuItem>
                                        <MenuItem value="bubble">Bubble Chart</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item style={{justifyContent: "center"}} className={classes.flexAlignCenter}>
                                <FormControl variant="filled" className={classes.formControl} hiddenLabel margin="dense">
                                    <Select disableUnderline={true} 
                                    value={chartProperties[0].y.num} onChange={(e) => handleYAxisChange(e, 0)} aria-label="Chart Y Axis"
                                    classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                        {rows[0].map((row:any, colIndex:number) => {
                                            return (
                                            <MenuItem key={'axis ' + colIndex} value={colIndex}>{row || 'no title'}</MenuItem>
                                        )})}
                                    </Select>
                                </FormControl>
                                <Typography variant="h6" style={{color: '#fff'}}>vs</Typography>
                                <FormControl variant="filled" className={classes.formControl} hiddenLabel margin="dense">
                                    <Select disableUnderline={true} 
                                    value={chartProperties[0].x.num} onChange={(e) => handleXAxisChange(e, 0)} aria-label="Chart X Axis"
                                    classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                        {rows[0].map((row:any, colIndex:number) => {
                                            return (
                                            <MenuItem key={'axis ' + colIndex} value={colIndex}>{row || 'no title'}</MenuItem>
                                        )})}
                                    </Select>
                                </FormControl>
                                {chartProperties[0].type === 'bubble' && <Typography variant="h6" style={{color: '#fff'}}>vs</Typography>}
                                {chartProperties[0].type === 'bubble' && <FormControl variant="filled" className={classes.formControl} hiddenLabel margin="dense">
                                    <Select disableUnderline={true}
                                    value={chartProperties[0].z.num} onChange={(e) => handleZAxisChange(e, 0)} aria-label="Chart Z Axis"
                                    classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                        {rows[0].map((row:any, colIndex:number) => {
                                            return (
                                                <MenuItem key={'axis ' + colIndex} value={colIndex}>{row || 'no title'}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>}
                            </Grid>
                            <Grid item className={classes.flexAlignCenter}>
                                <Button variant="contained" className={classes.optionsButton} onClick={(e) => toggleChartOptions(e, 1)}>
                                    Options
                                </Button>
                                {chartProperties[0].type === 'scatter' && <ScatterOptionsDialog property={chartProperties[0]} index={1} handlePropertyChange={handlePropertyChange}
                                handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} />}
                                {chartProperties[0].type === 'line' && <LineOptionsDialog property={chartProperties[0]} index={1} handlePropertyChange={handlePropertyChange}
                                handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} />}
                                {chartProperties[0].type === 'bar' || chartProperties[0].type === 'histogram' ? <BarOptionsDialog property={chartProperties[0]} index={1} handlePropertyChange={handlePropertyChange}
                                handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} /> : ''}
                                {chartProperties[0].type === 'pie' || chartProperties[0].type === 'polar' ? <PieOptionsDialog property={chartProperties[0]} index={1} handlePropertyChange={handlePropertyChange}
                                handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} /> : ''}
                                {chartProperties[0].type === 'bubble' && <BubbleOptionsDialog property={chartProperties[0]} index={1} handlePropertyChange={handlePropertyChange}
                                handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} />}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {chartProperties.map((property:any, index:number) => {
                if(index === 0) return
                return (
                    <Grid key={'regession ' + index} item container xs={12} sm={rows[0].length === 2 ? 12 : 9} className={`${classes.topPadding} ${classes.relative} ${classes.regressionContainer} ${index % 2 !== 0 ? classes.darkerBg : ''}`}>
                        
                        <IconButton disableRipple aria-label="remove regression" className={classes.removeRegressionBtn}
                        onClick={(e) => removeProperty(index)} >
                            <DeleteOutlineIcon />
                        </IconButton>

                        <Grid container item sm={3} justify="center" alignItems="center">
                            <Typography variant="h5" className={classes.textWhite}>Regression {index}</Typography>
                        </Grid>
                        <Grid container item sm={9}>
                            <Grid container item xs={12} direction="row" alignItems="center" justify="space-around">
                                <Grid item className={`${classes.flexAlignCenter} ${classes.xSpace}`}>
                                    <FormControl variant="filled" className={`${classes.formControl} ${classes.formControlReg}`}>
                                        <InputLabel id="regression-type-label" className={classes.chartTypeLabel}>Regression Type</InputLabel>
                                        <Select labelId="regression-type-label" id="regression-type" disableUnderline={true} 
                                        value={chartProperties[index].regressionType} onChange={(e) => handleRegressionTypeChange(e, index)} label="Regression Type"
                                        classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                            <MenuItem value="linear">Linear</MenuItem>
                                            <MenuItem value="quadratic">Quadratic</MenuItem>
                                            <MenuItem value="cubic">Cubic</MenuItem>
                                            <MenuItem value="quartic">Quartic</MenuItem>
                                            <MenuItem value="ln">Natural Log</MenuItem>
                                            <MenuItem value="exponential">Exponential</MenuItem>
                                            <MenuItem value="power">Power</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item className={`${classes.flexAlignCenter} ${classes.xSpace}`}>
                                    <Button variant="contained" className={classes.optionsButton} onClick={(e) => toggleChartOptions(e, index + 1)}>
                                        Options
                                    </Button>
                                    <RegressionOptionsDialog property={property} index={index + 1} handlePropertyChange={handlePropertyChange}
                                    handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} />
                                </Grid>
                            </Grid>
                            <Grid item container xs={12} className={classes.flexAlignJustifyCenter}>
                                <Grid item className={`${classes.flexAlignCenter} ${classes.xSpace}`}>
                                    <Typography variant="h5" className={classes.lightWhite}>
                                        <RegressionEquation type={property.regressionType} info={property.regressionInfo} />
                                    </Typography>
                                </Grid>
                                {property.regressionInfo.r !== undefined && <Grid item className={`${classes.flexAlignCenter} ${classes.xSpace}`}>
                                    <Typography variant="h5" className={classes.lightWhite}>
                                        r = {property.regressionInfo.r.toFixed(4)}
                                    </Typography>
                                </Grid>}
                                <Grid item className={`${classes.flexAlignCenter} ${classes.xSpace}`}>
                                    <Typography variant="h5" className={classes.lightWhite}>
                                        r<sup>2</sup> = {property.regressionInfo.r2.toFixed(4)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )
            })}
        </Grid>
    )
}