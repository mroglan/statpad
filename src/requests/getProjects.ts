import database from '../database/database'

export default async function getProjects(filters) {
    const db = await database()
    const projects = db.collection('projects').find(filters).toArray()

    return projects
}