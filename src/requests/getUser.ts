import {NextPageContext, GetServerSidePropsContext} from 'next'
import {verify} from 'jsonwebtoken'
import Router from 'next/router'
import {parseCookies} from 'nookies'

export default async function getUser(ctx: GetServerSidePropsContext) {
    try {
        //console.log(process.env.API_ROUTE)
        //console.log('cookies', parseCookies(ctx))

        const {auth} = parseCookies(ctx)

        const user = await new Promise((resolve, reject) => {
            verify(auth, process.env.SIGNATURE, async (err, decoded) => {
                if(!err && decoded) {
                    resolve(decoded)
                }
        
                reject('Not authenticated')
            })
        })

        return user
    } catch(e) {
        console.log('rejected')
        if(!ctx.req) {
            Router.replace('/login')
            return {}
        }
    
        if(ctx.req) {
            ctx.res?.writeHead(302, {
                Location: `${process.env.BASE_ROUTE}/login`
            })
            ctx.res?.end()
            return
        }
    }
}