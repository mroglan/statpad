import Router from 'next/router'

const logout = async () => {
    const res = await fetch('http://localhost:3000/api/logout', {
        method: 'POST'
    })
    if(res.status !== 200) {
        console.log('Something went wrong')
        return
    }
    Router.push('/login')
}

export default logout