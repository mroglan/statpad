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

export default function AboutSideNav() {

    const classes = useStyles()
    return (
        <List component="nav" style={{padding: 0}}>
            <Link href="/about/resources">
                <ListItem button className={classes.listItem}>
                    <ListItemText className={classes.listText}>
                        Resources
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/about/strangestuff">
                <ListItem button className={classes.listItem}>
                    <ListItemText className={classes.listText}>
                        Strange Stuff
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/about/games">
                <ListItem button className={classes.listItem}>
                    <ListItemText className={classes.listText}>
                        Games
                    </ListItemText>
                </ListItem>
            </Link>
        </List>
    )
}