import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Link from 'next/link'

const useStyles = makeStyles(theme => ({
    listText: {
        color: theme.palette.primary.light,
        '&:hover': {
            color: '#fff'
        }
    },
    listItem: {
        borderBottom: '1px solid hsl(214, 41%, 30%)'
    }
}))

export default function ManualSideNav() {

    const classes = useStyles()
    return (
        <List component="nav" style={{padding: 0}}>
            <Link href="/manual/data">
                <ListItem button className={classes.listItem}>
                    <ListItemText className={classes.listText}>
                        Data
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/manual/graphs">
                <ListItem button className={classes.listItem}>
                    <ListItemText className={classes.listText}>
                        Graphs
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/manual/simprob">
                <ListItem button className={classes.listItem}>
                    <ListItemText className={classes.listText}>
                        Simulations &amp; Probability
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/manual/confidenceintervals">
                <ListItem button className={classes.listItem}>
                    <ListItemText className={classes.listText}>
                        Confidence Intervals
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/manual/hypothesistests">
                <ListItem button className={classes.listItem}>
                    <ListItemText className={classes.listText}>
                        Hypothesis Tests
                    </ListItemText>
                </ListItem>
            </Link>
        </List>
    )
}