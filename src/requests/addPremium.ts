

export default async function AddPremium() {

    const res = await fetch(`${process.env.API_ROUTE}/premium/addpremium`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if(res.status !== 200) {
        return false
    }
    return true
}