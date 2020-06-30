import { GetServerSidePropsContext } from "next";
import {ObjectId} from 'mongodb'
import Router from 'next/router'

export default function verifyEditor(ctx:GetServerSidePropsContext, userId:string, editors:string[]) {

    const isEditor = editors.includes(userId)

    if(!isEditor && !ctx.req) {
        Router.replace('/projects')
        return {}
    }

    if(!isEditor && ctx.req) {
        ctx.res?.writeHead(302, {
            Location: `${process.env.BASE_ROUTE}/projects`
        })
        ctx.res?.end()
        return
    }
}