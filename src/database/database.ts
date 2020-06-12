import {MongoClient} from 'mongodb'

const client = new MongoClient(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

export default async function database() {
    if(!client.isConnected()) await client.connect()
    //const dbClient = client
    const db = client.db('statpad')
    return db
}