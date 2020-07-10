

export default async function addPremiumToJWT() {

    await fetch(`${process.env.API_ROUTE}/premium/addpremiumtojwt`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}