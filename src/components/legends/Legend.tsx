import PlotLegend from './PlotLegend'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    legendContainer: {
        [theme.breakpoints.up('sm')]: {
            width: '100%'
        }
    }
}))

interface ILegend {
    properties: any[];
    length: number;
}

export default function Legend({properties, length}: ILegend) {
    const classes = useStyles()
    return (
        <>
        {properties.map((property:any, index:number) => {
            if(property.type === 'scatter' || property.type === 'bubble') {
                return <Grid key={'legend ' + index} item className={`${length > 2 ? classes.legendContainer : ''}`}>
                    <PlotLegend background={property.options.points.color} title={property.label} />
                </Grid>
            } else if(property.type === 'regression' || property.type === 'line') {
                return <Grid key={'legend ' + index} item className={`${length > 2 ? classes.legendContainer : ''}`}>
                    <PlotLegend background={property.options.line.color} title={property.label} />
                </Grid>
            } else if(property.type === 'bar' || property.type === 'histogram') {
                return <Grid key={'legend ' + index} item className={`${length > 2 ? classes.legendContainer : ''}`}>
                    <PlotLegend background={property.options.bar.backgroundColor} title={property.label} />
                </Grid>
            }
        })}
        </>
    )
}