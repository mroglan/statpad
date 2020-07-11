import Head from 'next/head'
import {makeStyles} from '@material-ui/core/styles'
import {Box, Grid, Typography} from '@material-ui/core'
import {useState, useEffect} from 'react'
import Header from '../../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../../requests/authenticated'
import getUser from '../../requests/getUser'
import PremiumInfoBooklet from '../../components/premium/PremiumInfoBooklet'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    }
}))

export default function Premium({loggedIn, user}) {

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Header loggedIn={loggedIn} user={user} />
            {/* turn page animation to revaeal features... */}
            <Box>
                <PremiumInfoBooklet />
            </Box>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const isAuth = await authenticated(ctx)
    const user = isAuth ? await getUser(ctx) : null

    return {props: {loggedIn: isAuth, user}}
}