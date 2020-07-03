import {List, ListItem, ListItemIcon, ListItemText, Grid, Typography, IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Link from 'next/link'
import {Component} from './listsInterfaces'
import {useState, useMemo, MouseEvent} from 'react'
import EditIcon from '@material-ui/icons/Edit';
import EditComponentDialog from '../dialogs/editComponentDialog'

const useStyles = makeStyles(theme => ({
    textWhite: {
        color: '#fff'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .7)'
    },
    darkerBg: {
        backgroundColor: 'hsl(241, 82%, 46%)',
    },
    border: {
        border: '1px solid ' + theme.palette.primary.dark,
        borderRadius: '.5rem'
    },
    textSuccess: {
        color: theme.palette.success.main
    },
    typeContainer: {
        flexBasis: 100
    },
    listSpacing: {
        margin: '1rem 0'
    },
    editButton: {
        backgroundColor: 'hsla(31, 82%, 54%, 1)',
        color: 'rgba(255, 255, 255, .7) ',
        fontSize: '.7rem',
        opacity: 0,
        position: 'absolute',
        zIndex: 12,
        padding: 3,
        '&:hover': {
            backgroundColor: 'hsla(31, 82%, 54%, .9)',
            color: '#fff'
        },
    },
    compGrid: {
        '&:hover': {
            '& button': {
                opacity: 1
            }
        }
    }
}))

interface Props {
    components: Component[];
}

interface NewInfo {
    name: string;
}

export default function CopmonentList({components}:Props) {

    const [viewEditModal, setViewEditModal] = useState(-1)
    const [stateComponents, setStateComponents] = useState(components)

    useMemo(() => setStateComponents(components), [components])

    const formattedDate = (inputDate:string) => {
        const date = new Date(inputDate)
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date ) 
        return `${day}-${month}-${year}`
    }

    const toggleEditModal = (editIndex:number, newInfo?:NewInfo) => {
        setViewEditModal(current => current === editIndex ? -1 : editIndex)
        if(!newInfo) return
        const copy = [...stateComponents]
        copy[editIndex] = {
            ...copy[editIndex],
            name: newInfo.name
        }
        setStateComponents(copy)
    }

    const handleEditClick = (e:MouseEvent, editIndex:number) => {
        e.preventDefault()
        toggleEditModal(editIndex)
    }

    const classes = useStyles()
    return (
        <List style={{width: '100%'}}>
            {stateComponents.map((component, index) => (
                <Link href="/projects/[id]/[compId]" as={`/projects/${component.project}/${component._id}`} key={index}>
                    <ListItem button className={`${classes.border} ${classes.listSpacing}`}>
                        <Grid container wrap="nowrap" spacing={5} className={classes.compGrid}>
                            <Grid item className={`${classes.typeContainer}`}>
                                <Typography variant="h4" className={classes.textSuccess}>
                                    {component.type === 'data' ? 'D' : 
                                    component.type === 'graphs' ? 'G' : 
                                    component.type === 'sim+prob' ? 'S&P' :
                                    component.type === 'confidenceIntervals' ? 'CI' :
                                    component.type === 'hypothesisTests' ? 'HT' : '???' }
                                </Typography>
                            </Grid>
                            <Grid item style={{flexGrow: 1}}>
                                <Typography variant="h4" className={classes.textWhite}>
                                    {component.name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" className={classes.dimWhite}>
                                    {formattedDate(component.updateDate)}
                                </Typography>
                            </Grid>
                            <IconButton className={classes.editButton} onClick={(e) => handleEditClick(e, index)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </ListItem>
                </Link>
            ))}
            {viewEditModal > -1 && <EditComponentDialog open={true} toggleOpen={toggleEditModal} 
            component={stateComponents[viewEditModal]} index={viewEditModal} />}
        </List>
    )
}