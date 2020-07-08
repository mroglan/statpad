

export default async function UpdateCompDate(id:string) {

    await fetch(`${process.env.API_ROUTE}/projects/updatecompdate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    })

}