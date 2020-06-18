import database from '../database/database'

export default async function getProjects(filters) {
    const db = await database()
    console.log(filters)
    const projects = db.collection('projects').find(filters).sort({updateDate: -1}).toArray()

    return projects
}