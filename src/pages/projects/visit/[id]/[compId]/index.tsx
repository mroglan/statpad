import { GetServerSideProps, GetServerSidePropsContext } from "next";
import getUser from "../../../../../requests/getUser";
import database from "../../../../../database/database";
import {makeStyles} from '@material-ui/core/styles'
import VisitSideComponentsList from '../../../../../components/lists/VisitSideComponentsList'
import Header from "../../../../../components/nav/Header";
import {Grid, Paper, Box, Typography} from '@material-ui/core'
import getComponents from "../../../../../requests/getComponents";
import VisitInnerProjectNav from '../../../../../components/nav/VisitInnerProjectNav'
import {ObjectId} from 'mongodb'
import DataTable from "../../../../../components/projectComponents/graphSubs/DataTable";
import {useState} from 'react'
import VisitData from '../../../../../components/projectComponents/visit/VisitData'
import VisitGraphs from '../../../../../components/projectComponents/visit/VisitGraphs'
import VisitSimProb from '../../../../../components/projectComponents/visit/VisitSimProb'
import VisitConfidenceIntervals from '../../../../../components/projectComponents/visit/VisitConfidenceIntervals'
import VisitHypothesisTests from '../../../../../components/projectComponents/visit/VisitHypothesisTests'
import verifyEditor from '../../../../../requests/verifyEditor'
import checkObjectId from '../../../../../utilities/checkObjectId'
import authenticated from '../../../../../requests/authenticated'
import Head from 'next/head'

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

export default function Component({user, loggedIn, component, project, allComponents, data}) {

    const classes = useStyles()
    return (
        <>
        <Head>
            <title>{component.name} | {project.name} | Visit</title>
            <meta name="description" content={`Visit ${component.name} from project ${project.name}`} />
        </Head>
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            <Grid container spacing={3}>
                <Grid item md={3} style={{margin: '0 auto'}}>
                    <Paper className={classes.sideBar}>
                        <VisitSideComponentsList components={allComponents} current={component} />
                    </Paper>
                </Grid>
                <Grid item md={9} xs={12} className={classes.mainContent}>
                    <Box mb={3}>
                        <VisitInnerProjectNav tabs={[project, component]} />
                    </Box>
                    <Box my={3}>
                        {/* <DataTable syncData={syncData} initialData={initialData} syncing={syncing} /> */}
                        {component.type === 'data' ? <VisitData component={component} /> : 
                        component.type === 'graphs' ? <VisitGraphs component={component} data={data} /> :
                        component.type === 'sim+prob' ? <VisitSimProb component={component} data={data} /> : 
                        component.type === 'confidenceIntervals' ? <VisitConfidenceIntervals component={component} data={data} /> : 
                        <VisitHypothesisTests component={component} data={data} /> }
                    </Box>
                </Grid>
            </Grid>
        </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    try {
        const isAuth = await authenticated(ctx)
        const user = isAuth ? await getUser(ctx) : null
        const db = await database()
        const compId = Array.isArray(ctx.params.compId) ? ctx.params.compId[0] : ctx.params.compId
        const projId = Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id

        if(!checkObjectId(compId) || !checkObjectId(projId)) throw 'invalid objectId'

        const [component, project, allComponents] = await Promise.all([db.collection('components').findOne({_id: new ObjectId(compId)}), 
        db.collection('projects').findOne({_id: new ObjectId(projId)}), getComponents(new ObjectId(projId))])

        if(!project.public) throw 'not public'

        const data = []
        allComponents.forEach((comp) => {
            if(comp.type === 'data') data.push(comp.data)
        })

        return {props: {user, loggedIn: isAuth, component: JSON.parse(JSON.stringify(component)), project: JSON.parse(JSON.stringify(project)), 
        allComponents: JSON.parse(JSON.stringify(allComponents)), data}}
    } catch(e) {
        console.log(e)
        ctx.res.writeHead(500, {
            Location: `${process.env.BASE_ROUTE}/projects`
        })
        ctx.res.end()
        return {props: {}}
    }
}