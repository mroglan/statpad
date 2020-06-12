import { Grid, Box } from "@material-ui/core";


interface PlotLegendProps {
    background: string;
    title: string;
}

export default function PlotLegend({background, title}: PlotLegendProps) {
    
    return (
        <Grid item container direction="row" justify="center" alignItems="center">
            <Box style={{width: 30, height: 15, borderRadius: 5, backgroundColor: `${background}`}}>
            </Box>
            <Box style={{color: "#fff", fontSize: 15, paddingLeft: 3}}>
                {title || 'None'}
            </Box>
        </Grid>
    )
}