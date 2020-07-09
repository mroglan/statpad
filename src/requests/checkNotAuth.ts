import {GetServerSidePropsContext} from 'next'
import {parseCookies} from 'nookies'
import {verify} from 'jsonwebtoken'

export default async function(ctx:GetServerSidePropsContext) {
    // const res = await fetch(`${process.env.API_ROUTE}/checknotauthenticated`, {
    //     headers: {
    //         cookie: ctx.req?.headers.cookie
    //     }
    // })
    // console.log('got response')
    // if(res.status === 401) {
    //     console.log('already authenticated...')
    //     //ctx.res.setHeader('Location', 'http://localhost:3000/dashboard')
    //     ctx.res.writeHead(302, {
    //         Location: `${process.env.BASE_ROUTE}/dashboard`
    //     })
    //     ctx.res.end()
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
    if(!user) return

    console.log('already authenticated')
    ctx.res.writeHead(302, {
        Location: `${process.env.BASE_ROUTE}/dashboard`
    })
    ctx.res.end()
}