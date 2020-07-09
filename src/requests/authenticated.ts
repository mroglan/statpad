import { GetServerSidePropsContext } from "next";
import {parseCookies} from 'nookies'
import {verify} from 'jsonwebtoken'

export default async function Authenticated(ctx:GetServerSidePropsContext) {
    // const res = await fetch(`${process.env.API_ROUTE}/checknotauthenticated`, {
    //     headers: {
    //         cookie: ctx.req?.headers.cookie
    //     }
    // })
    // if(res.status === 401) {
    //     return true
    // } else {
    //     return false
    // }

    const {auth} = parseCookies(ctx)

    const user = await new Promise((resolve) => {
        verify(auth, process.env.SIGNATURE, async (err, decoded) => {
            if(!err && decoded) {
                resolve(decoded)
            }
    
            resolve(null)
        })
    })
    if(!user) return false
    return true
}