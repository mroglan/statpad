import { Grid, Input, Typography, Button, Box, FormControl, InputLabel, Select, MenuItem, Switch, IconButton } from "@material-ui/core";
import {useState, useMemo} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import MixedChart from './charts/MixedChart'
import ScatterOptionsDialog from './dialogs/scatterOptionsDialog'
import LineOptionsDialog from './dialogs/lineOptionsDialog'
import BarOptionsDialog from './dialogs/barOptionsDialog'
import PieOptionsDialog from './dialogs/pieOptionsDialog'
import BubbleOptionsDialog from './dialogs/bubbleOptionsDialog'
import GraphOptionsDialog from './dialogs/graphOptionsDialog'
import Legend from './legends/Legend'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

interface GraphProps {
    rows: any;
}

const useStyles = makeStyles(theme => ({
    extraPadding: {
        marginBottom: '2rem',
        marginTop: '1rem',
    },
    flexAlignJustifyCenter: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flexAlignCenter: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center'
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
    graphOptionsContainer: {
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 3
        }
    },
    optionsButton: {
        backgroundColor: 'hsl(241, 82%, 70%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(241, 82%, 60%)'
        }
    },
    chartSelectionContainer: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-around'
    },
    textWhite: {
        color: '#fff'
    },
    appearAnimation: {
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
    chartTypeLabel: {
        color: 'hsl(241, 52%, 80%)'
    },
    topPadding: {
        paddingTop: theme.spacing(3)
    },
    darkerBg: {
        backgroundColor: 'hsl(241, 82%, 46%)'
    },
    deleteButton: {
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

export default function MixedGraph({rows}: GraphProps) {

    const [chartProperties, setChartProperties] = useState([{
        type: 'scatter',
        label: null,
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

    const [optionsSwitch, setOptionsSwitch] = useState([false, false])

    const [graphProperties, setGraphProperties] = useState({
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
            },
            x: 0,
            y: 1, 
            z: 1
        },
        graphTitle: {
            color: '#fff',
            title: null
        },
        legend: {
            display: false
        }
    })

    const handleGraphPropertiesChange = (newGraphProperties:any) => {
        setGraphProperties(newGraphProperties)
    }

    const handleChartTypeChange = (e:any, index:number) => {
        const chartPropertiesCopy = [...chartProperties]
        chartPropertiesCopy[index].type = e.target.value
        setChartProperties(chartPropertiesCopy)
    }

    const handleTitleChange = (e:any) => {
        const graphPropertiesCopy = {...graphProperties}
        graphPropertiesCopy.graphTitle.title = e.target.value
        setGraphProperties(graphPropertiesCopy)
    }

    const handlePropertyChange = (newProperties:any, index:number) => {
        const chartPropertiesCopy = [...chartProperties]
        //console.log(chartPropertiesCopy[index])
        chartPropertiesCopy[index] = newProperties
        setChartProperties(chartPropertiesCopy)
    }

    const toggleChartOptions = (e:any, index:number) => {
        const newOptionsSwitch = optionsSwitch.map((option, i) => i === index ? true : false)
        setOptionsSwitch(newOptionsSwitch)
    }

    const handleOptionsClose = () => {
        const newOptionsSwitch = optionsSwitch.map(option => false)
        setOptionsSwitch(newOptionsSwitch)
    }

    const addNewChart = () => {
        const chartPropertiesCopy = [...chartProperties]
        chartPropertiesCopy.push({
            type: 'scatter',
            label: null,
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
        })
        const optionsSwitchCopy = [...optionsSwitch]
        optionsSwitchCopy.push(false)
        setOptionsSwitch(optionsSwitchCopy)
        setChartProperties(chartPropertiesCopy)
    }

    const handleYAxisChange = (e:any) => {
        const graphPropertiesCopy = {...graphProperties}
        graphPropertiesCopy.axis.y = Number(e.target.value)
        setGraphProperties(graphPropertiesCopy)
    }

    const handleXAxisChange = (e:any) => {
        const graphPropertiesCopy = {...graphProperties}
        graphPropertiesCopy.axis.x = Number(e.target.value)
        setGraphProperties(graphPropertiesCopy)
    }

    const handleZAxisChange = (e:any) => {
        const graphPropertiesCopy = {...graphProperties}
        graphPropertiesCopy.axis.z = Number(e.target.value)
        setGraphProperties(graphPropertiesCopy)
    }

    const deleteChart = (index:number) => {
        const chartPropertiesCopy = [...chartProperties]
        chartPropertiesCopy.splice(index, 1)
        setChartProperties(chartPropertiesCopy)
    }

    const classes = useStyles()
    return (
        <Grid container>
            <Grid item sm={rows[0].length === 2 ? 12 : 9}>
                <MixedChart data={rows} properties={chartProperties} graphProperties={graphProperties} />
            </Grid>
            <Grid item container md={rows[0].length === 2 ? 12 : 3} direction="row"
            justify="center" alignItems="center" spacing={3}>
                {graphProperties.legend.display && <Legend properties={chartProperties} length={rows[0].length} /> }
            </Grid>
            <Grid container item xs={12} sm={rows[0].length === 2 ? 12 : 9} className={classes.extraPadding}>
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
                    <Box px={3}>
                        <Button variant="contained" className={`${classes.optionsButton}`}
                        onClick={(e) => addNewChart()} >
                            New Chart
                        </Button>
                    </Box> 
                </Grid>
            </Grid>
            <Grid item xs={12} sm={rows[0].length === 2 ? 12 : 9} className={classes.chartSelectionContainer}>
                <Grid xs={12} container item>
                    <Grid container item sm={3} justify="center" alignItems="center">
                        <Typography variant="h4" className={classes.textWhite}>Axes</Typography>
                    </Grid>
                    <Grid item container sm={9} direction="row" className={classes.flexAlignCenter}>
                        <Box px={3} className={classes.flexAlignCenter}>
                            <FormControl variant="filled" className={classes.formControl} hiddenLabel margin="dense">
                                <Select disableUnderline={true} 
                                value={graphProperties.axis.y} onChange={(e) => handleYAxisChange(e)} aria-label="Chart Y Axis"
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
                                value={graphProperties.axis.x} onChange={(e) => handleXAxisChange(e)} aria-label="Chart X Axis"
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
                                value={graphProperties.axis.z} onChange={(e) => handleZAxisChange(e)} aria-label="Chart Z Axis"
                                classes={{icon: classes.textWhite, filled: classes.textWhite}}>
                                    {rows[0].map((row:any, colIndex:number) => {
                                        return (
                                            <MenuItem key={'axis ' + colIndex} value={colIndex}>{row || 'no title'}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={rows[0].length === 2 ? 12 : 9} className={classes.chartSelectionContainer}>
                {chartProperties.map((property:any, index:number) => {
                    return (
                        <Grid key={index} xs={12} style={{position: 'relative'}} container item className={`${index !== 0 ? classes.appearAnimation : ''} ${classes.topPadding} ${index % 2 === 0 ? classes.darkerBg : ''}`}>
                            <IconButton disableRipple aria-label="remove chart" className={classes.deleteButton}
                            onClick={(e) => deleteChart(index)} >
                                <DeleteOutlineIcon />
                            </IconButton>
                            <Grid container item sm={3} justify="center" alignItems="center">
                                <Typography variant="h4" className={classes.textWhite}>Chart {index + 1}</Typography>
                            </Grid>
                            <Grid item container sm={9} direction="row" className={classes.flexAlignCenter}>
                                <Box px={3} className={classes.flexAlignCenter}>
                                    <FormControl variant="filled" className={classes.formControl}>
                                        <InputLabel id="plot-type-label" className={classes.chartTypeLabel}>Chart Type</InputLabel>
                                        <Select labelId="plot-type-label" id="plot-type" disableUnderline={true} 
                                        value={property.type} onChange={(e) => handleChartTypeChange(e, index)} label="Chart Type"
                                        classes={{icon: classes.textWhite, filled: classes.textWhite }}>
                                            <MenuItem value="scatter">Scatter Chart</MenuItem>
                                            <MenuItem value="line">Line Chart</MenuItem>
                                            <MenuItem value="histogram">Histogram</MenuItem>
                                            <MenuItem value="bar">Bar Chart</MenuItem>
                                            <MenuItem value="bubble">Bubble Chart</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box px={3} className={classes.flexAlignCenter}>
                                    <Button variant="contained" className={classes.optionsButton} onClick={(e) => toggleChartOptions(e, index + 1)}>
                                        Options
                                    </Button>
                                    {property.type === 'scatter' && <ScatterOptionsDialog property={property} index={index + 1} handlePropertyChange={handlePropertyChange}
                                    handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} />}
                                    {property.type === 'line' && <LineOptionsDialog property={property} index={index + 1} handlePropertyChange={handlePropertyChange}
                                    handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} />}
                                    {property.type === 'bar' || chartProperties[0].type === 'histogram' ? <BarOptionsDialog property={property} index={index + 1} handlePropertyChange={handlePropertyChange}
                                    handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} /> : ''}
                                    {property.type === 'pie' || chartProperties[0].type === 'polar' ? <PieOptionsDialog property={property} index={index + 1} handlePropertyChange={handlePropertyChange}
                                    handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} /> : ''}
                                    {property.type === 'bubble' && <BubbleOptionsDialog property={property} index={index + 1} handlePropertyChange={handlePropertyChange}
                                    handleOptionsClose={handleOptionsClose} optionsSwitch={optionsSwitch} />}
                                </Box>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    )
}