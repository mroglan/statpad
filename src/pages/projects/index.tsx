import { GetServerSideProps, GetServerSidePropsContext } from "next";
import getUser from "../../requests/getUser";
import getProjects from '../../requests/getProjects'
import database from '../../database/database'
import SideNav from '../../components/nav/SideNav'

export default function Projects({user, projects}) {


}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const user = await getUser(ctx)
    const projects = await getProjects({user: user._id})

    return {props: {user, projects}}
}