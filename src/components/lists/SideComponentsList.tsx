import {List, ListItem, ListItemText, Grid, Typography, Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Link from 'next/link'

const useStyles = makeStyles(theme => ({
    listItem: {
        borderBottom: '1px solid hsl(214, 41%, 30%)',
        padding: '.7rem .5rem',
        borderRadius: '.1rem'
    },
    active: {
        backgroundColor: 'hsla(241, 82%, 50%, .8)',
        '&:hover': {
            backgroundColor: 'hsla(241, 82%, 50%, 1)'
        }
    },
    typeLabel: {
        color: theme.palette.success.main
    },
    listText: {
        color: theme.palette.primary.light,
        '&:hover': {
            color: '#fff'
        }
    }
}))

export default function SideComponentsList({components, current}) {

    const classes = useStyles()
    return (
        <List component="nav" style={{padding: 0}}>
            {components.map((component, index:number) => (
                <Link href="/projects/[id]/[compId]" as={`/projects/${component.project}/${component._id}`} key={index}>
                    <ListItem button className={`${classes.listItem} ${component._id === current._id ? classes.active : ''}`}>
                        <Grid container direction="row" wrap="nowrap" alignItems="center">
                            <Grid item style={{flexBasis: 50}}>
                                <Typography variant="subtitle1" className={classes.typeLabel}>
                                    {component.type === 'data' ? 'D' : 
                                    component.type === 'graphs' ? 'G' : 
                                    component.type === 'sim+prob' ? 'S&P' :
                                    component.type === 'confidenceIntervals' ? 'CI' :
                                    component.type === 'hypothesisTests' ? 'HT' : '???' }
                                </Typography>
                            </Grid>
                            <Grid item style={{flexGrow: 1}}>
                                <Typography variant="subtitle1" className={classes.listText}>
                                    {component.name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                </Link>
            ))}
        </List>
    )
}