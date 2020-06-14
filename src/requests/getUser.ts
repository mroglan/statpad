import {NextPageContext, GetServerSidePropsContext} from 'next'
import {verify} from 'jsonwebtoken'
import Router from 'next/router'

export default async function getUser(ctx: GetServerSidePropsContext) {
    try {
        const res = await fetch('http://localhost:3000/api/finduser', {
            headers: {
                cookie: ctx.req?.headers.cookie
            }
        })

        if(res.status === 401 && !ctx.req) {
            Router.replace('/login')
            return {}
        }
    
        if(res.status === 401 && ctx.req) {
            ctx.res?.writeHead(302, {
                Location: 'http://localhost:3000/login'
            })
            ctx.res?.end()
            return
        }

        const json = res.json()
        return json
    } catch(e) {
        return null
    }
}