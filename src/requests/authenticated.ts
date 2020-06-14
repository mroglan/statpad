import { GetServerSidePropsContext } from "next";


export default async function Authenticated(ctx:GetServerSidePropsContext) {
    const res = await fetch('http://localhost:3000/api/checknotauthenticated', {
        headers: {
            cookie: ctx.req?.headers.cookie
        }
    })
    if(res.status === 401) {
        return true
    } else {
        return false
    }
}