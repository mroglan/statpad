import Router from 'next/router'

const logout = async () => {
    const res = await fetch(`${process.env.API_ROUTE}/logout`, {
        method: 'POST'
    })
    if(res.status !== 200) {
        console.log('Something went wrong')
        return
    }
    Router.push('/login')
}

export default logout