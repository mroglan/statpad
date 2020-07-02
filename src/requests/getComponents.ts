import database from '../database/database'
import {ObjectId} from 'mongodb'

export default async function getComponents(projectId:ObjectId) {
    const db = await database()
    console.log('projectId', projectId)
    const components = await db.collection('components').find({project: projectId}).sort({updateDate: -1}).toArray()
    //console.log(components) 
    return components
}