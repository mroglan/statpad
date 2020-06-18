import database from '../database/database'

export default async function getComponents(projectId) {
    const db = await database()
    console.log('projectId', projectId)
    const components = await db.collection('components').find({project: projectId}).sort({updateDate: -1}).toArray()
    //console.log(components) 
    return components
}