import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core'
import {useRef, useState} from 'react'
import Router from 'next/router'

const useStyles = makeStyles(theme => ({
    dialog: {
        backgroundColor: 'hsl(241, 82%, 60%)',
    },
    textWhite: {
        color: '#fff'
    },
    dimWhite: {
        color: 'rgba(255, 255, 255, .5)'
    },
    label: {
        color: 'hsl(241, 52%, 80%)'
    },
    newButton: {
        backgroundColor: 'hsl(140, 81%, 31%)',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'hsl(140, 60%, 31%)'
        }
    }
}))

export default function NewComponentDialog({open, toggleOpen, components, projectId}) {

    const nameRef = useRef<HTMLInputElement>()
    //const typeRef = useRef<HTMLInputElement>()

    const [nameErr, setNameErr] = useState('')
    const [type, setType] = useState('data')

    const newComponent = async () => {
        if(components.find(component => component.name === nameRef.current.value)) {
            setNameErr('Cannot have duplicate components in one project')
            return
        }
        console.log('type', type)
        const res = await fetch(`${process.env.API_ROUTE}/projects/newcomponent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId: projectId,
                name: nameRef.current.value,
                type: type
            })
        })
        const json = res.json()
        if(res.status !== 200) return
        toggleOpen(JSON.parse(JSON.stringify(json)))
    }

    const classes = useStyles()
    return (
        <Dialog fullWidth open={open} onClose={toggleOpen} aria-labelledby="New Component Dialog" 
        classes={{paper: classes.dialog}}>
            <DialogTitle style={{textAlign: "center"}} className={classes.textWhite}>New Component</DialogTitle>
            <DialogContent>
                <Box mx={3} mb={3}>
                    <TextField label="Component Name" variant="outlined" InputProps={{className: classes.textWhite}}
                    InputLabelProps={{className: classes.dimWhite}} FormHelperTextProps={{className: classes.dimWhite}}
                    inputRef={nameRef} fullWidth /> 
                </Box>
                <Box m={3}>
                    <FormControl variant="filled" fullWidth>
                        <InputLabel id="component-type-label" className={classes.label}>Type</InputLabel>
                        <Select labelId="component-type-label" disableUnderline={true}
                        classes={{icon: classes.textWhite, filled: classes.textWhite }} value={type}
                        onChange={(e) => setType(e.target.value.toString())} >
                            <MenuItem value="data">Data</MenuItem>
                            <MenuItem value="graphs">Graphs</MenuItem>
                            <MenuItem value="sim+prob">Simulations &amp; Probability</MenuItem>
                            <MenuItem value="confidenceIntervals">Confidence Intervals</MenuItem>
                            <MenuItem value="hypothesisTests">Hypothesis Tests</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box m={3}>
                    <Button variant="contained" className={classes.newButton}
                    onClick={(e) => newComponent()} >
                        Create
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>  
    )
}