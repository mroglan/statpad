import DataTable from "../DataTable";
import {useState} from 'react'
import { Snackbar, IconButton } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import {useMemo} from 'react'

const useStyles = makeStyles(theme => ({
    successMsg: {
        backgroundColor: theme.palette.success.main
    },
    errorMsg: {
        backgroundColor: theme.palette.error.main
    }
}))

export default function Data({component}) {

    //console.log(component)

    const [syncing, setSyncing] = useState(false)
    const [error, setError] = useState(false)
    const [showSaved, setShowSaved] = useState(false)

    console.log('syncing', syncing)

    const initialData = useMemo(() => component.data.length > 0 ? component.data : [
        ['', ''], ['', ''], ['', ''],
        ['', ''], ['', ''], ['', '']
    ], [component])

    const syncData = async (newRows) => {
        setSyncing(true)
        const res = await fetch(`${process.env.API_ROUTE}/projects/updatecomponent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: component._id,
                type: component.type,
                data: newRows
            })
        })

        // const json = await res.json()
        // console.log(json)
        if(res.status !== 200) {
            setError(true)
        } else {
            setShowSaved(true)
        }
        setSyncing(false)
    }

    const classes = useStyles()

    return (
        <div>
            <DataTable syncData={syncData} initialData={initialData} syncing={syncing} basic={false} />
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} open={showSaved} onClose={(e) => setShowSaved(false)}
            message="Changes saved" autoHideDuration={6000} ContentProps={{classes: {
                root: classes.successMsg
            }}} action={
                <IconButton size="small" aria-label="close" onClick={(e) => setShowSaved(false)} style={{color: '#fff'}} >
                    <CloseIcon />
                </IconButton>
            } />
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} open={error} onClose={(e) => setError(false)}
            message="Error saving" autoHideDuration={6000} ContentProps={{classes: {
                root: classes.errorMsg
            }}} action={
                <IconButton size="small" aria-label="close" onClick={(e) => setError(false)} style={{color: '#fff'}}>
                    <CloseIcon />
                </IconButton>
            } />
        </div>
    )
}