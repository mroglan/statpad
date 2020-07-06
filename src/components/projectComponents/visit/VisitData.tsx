import DataTable from "../graphSubs/DataTable";
import {useState} from 'react'
import { Snackbar, IconButton } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import {useMemo} from 'react'
import {DataComp} from '../projectInterfaces'

const useStyles = makeStyles(theme => ({
    successMsg: {
        backgroundColor: theme.palette.success.main
    },
    errorMsg: {
        backgroundColor: theme.palette.error.main
    }
}))

interface Props {
    component: DataComp;
}

export default function Data({component}:Props) {

    
    const syncing = false
    const syncData = (cells) => console.log('nothing...')

    const initialData = useMemo(() => component.data.length > 0 ? component.data : [
        ['', ''], ['', ''], ['', ''],
        ['', ''], ['', ''], ['', '']
    ], [component])

    const classes = useStyles()

    return (
        <div>
            <DataTable syncData={syncData} initialData={initialData} syncing={syncing} basic={false} />
        </div>
    )
}