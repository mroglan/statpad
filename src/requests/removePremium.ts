

export default async function RemovePremium() {

    await fetch(`${process.env.API_ROUTE}/premium/removepremium`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}