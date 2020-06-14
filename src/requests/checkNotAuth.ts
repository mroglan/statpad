import {GetServerSidePropsContext} from 'next'

export default async function(ctx:GetServerSidePropsContext) {
    const res = await fetch('http://localhost:3000/api/checknotauthenticated', {
        headers: {
            cookie: ctx.req?.headers.cookie
        }
    })
    console.log('got response')
    if(res.status === 401) {
        console.log('already authenticated...')
        //ctx.res.setHeader('Location', 'http://localhost:3000/dashboard')
        ctx.res.writeHead(302, {
            Location: 'http://localhost:3000/dashboard'
        })
        ctx.res.end()
    }
}