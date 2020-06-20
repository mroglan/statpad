import { GetServerSideProps, GetServerSidePropsContext } from "next";
import getUser from "../../../../requests/getUser";
import database from "../../../../database/database";
import {makeStyles} from '@material-ui/core/styles'
import SideComponentsList from '../../../../components/lists/SideComponentsList'
import Header from "../../../../components/nav/Header";
import {Grid, Paper, Box, Typography} from '@material-ui/core'
import getComponents from "../../../../requests/getComponents";
import InnerProjectNav from '../../../../components/nav/InnerProjectNav'
import {ObjectId} from 'mongodb'
import DataTable from "../../../../components/DataTable";
import {useState} from 'react'
import Data from '../../../../components/projectComponents/Data'
import Graphs from '../../../../components/projectComponents/Graphs'
import SimProb from '../../../../components/projectComponents/SimProb'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    sideBar: {
        animation: '$appear 400ms',
        position: 'sticky',
        top: '10%',
        backgroundColor: 'hsl(241, 82%, 60%)', 
        maxHeight: '90vh',
        [theme.breakpoints.down('sm')]: {
            '& nav': {
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center',
                maxWidth: 600,
                [theme.breakpoints.down('xs')]: {
                    maxWidth: 300
                },
                '& > div': {
                    flexBasis: 300,
                    border: 'none'
                }
            }
        },
        '&::webkit-scrollbar': {
            display: 'none'
        },
        MsOverflowStyle: 'none'
    },
    '@keyframes appear': {
        '0%': {
            opacity: 0,
            transform: 'scale(0)',
        },
        '100%': {
            opacity: 1,
            transform: 'scale(1)',
        }
    },
    mainContent: {
        animation: '$appear 400ms',
    },
}))

export default function Component({user, component, project, allComponents, data}) {

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={true} />
            <Grid container spacing={3}>
                <Grid item md={3} style={{margin: '0 auto'}}>
                    <Paper className={classes.sideBar}>
                        <SideComponentsList components={allComponents} current={component} />
                    </Paper>
                </Grid>
                <Grid item md={9} xs={12} className={classes.mainContent}>
                    <Box mb={3}>
                        <InnerProjectNav tabs={[project, component]} />
                    </Box>
                    <Box my={3}>
                        {/* <DataTable syncData={syncData} initialData={initialData} syncing={syncing} /> */}
                        {component.type === 'data' ? <Data component={component} /> : 
                        component.type === 'graphs' ? <Graphs component={component} data={data} /> :
                        component.type === 'sim+prob' ? <SimProb component={component} data={data} /> : '' }
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user = await getUser(ctx)
    const db = await database()
    const compId = Array.isArray(ctx.params.compId) ? ctx.params.compId[0] : ctx.params.compId
    const projId = Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id

    // console.log('compId', compId)
    // console.log('projId', projId)

    const [component, project, allComponents] = await Promise.all([db.collection('components').findOne({_id: new ObjectId(compId)}), 
    db.collection('projects').findOne({_id: new ObjectId(projId)}), getComponents(new ObjectId(projId))])

    // console.log('component', component)
    // console.log('project', project)
    // console.log('allComponents', allComponents)

    console.log('component id', component._id)

    const data = []
    allComponents.forEach((comp) => {
        if(comp.type === 'data') data.push(comp.data)
    })

    return {props: {user, component: JSON.parse(JSON.stringify(component)), project: JSON.parse(JSON.stringify(project)), 
    allComponents: JSON.parse(JSON.stringify(allComponents)), data}}
}