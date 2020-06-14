import router from 'next/router'
import { GetServerSideProps, NextPageContext, GetServerSidePropsContext } from 'next'
import database from '../database/database'
import getUser from '../requests/getUser'
import Header from '../components/Header'

export default function Dashboard({user}) {

    return (
        <div>
            <Header loggedIn={true} />
            <pre>{JSON.stringify(user, null, 4)}</pre>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user = await getUser(ctx)
    console.log(user)
    return {props: {user}}
}