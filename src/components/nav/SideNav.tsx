import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
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

export default function SideNav() {

    // const ListItemLink = (props) => {
    //     return <ListItem component={Link} {...props} />
    // }

    const classes = useStyles()
    return (
        <List component="nav" style={{padding: 0}}>
            <Link href="/dashboard">
                <ListItem button className={classes.listItem}>
                    <ListItemIcon style={{color: 'hsl(3, 86%, 54%)'}}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText className={classes.listText}>
                        Dashboard
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/projects">
                <ListItem button className={classes.listItem}>
                    <ListItemIcon style={{color: 'hsl(283, 87%, 44%)'}}>
                        <BubbleChartIcon />
                    </ListItemIcon>
                    <ListItemText className={classes.listText}>
                        My Projects
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/projects/visit">
                <ListItem button className={classes.listItem}>
                    <ListItemIcon style={{color: 'hsl(178, 81%, 52%)'}}>
                        <DeviceHubIcon />
                    </ListItemIcon>
                    <ListItemText className={classes.listText}>
                        Visit Projects
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/create">
                <ListItem button className={classes.listItem}>
                    <ListItemIcon style={{color: 'hsl(46, 72%, 54%)'}}>
                        <DonutLargeIcon />
                    </ListItemIcon>
                    <ListItemText className={classes.listText}>
                        Basic Create
                    </ListItemText>
                </ListItem>
            </Link>
            <Link href="/about/games">
                <ListItem button>
                    <ListItemIcon style={{color: 'hsl(129, 62%, 42%)'}}>
                        <SportsEsportsIcon />
                    </ListItemIcon>
                    <ListItemText className={classes.listText}>
                        Bored?
                    </ListItemText>
                </ListItem>
            </Link>
        </List>
    )
}