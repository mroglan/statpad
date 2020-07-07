import database from '../database/database'
import {ObjectId} from 'mongodb'

export default async function getComponents(projectId:ObjectId) {
    const db = await database()
    console.log('projectId', projectId)
    const [components, update] = await Promise.all([
        db.collection('components').find({project: projectId}).sort({updateDate: -1}).toArray()
    ])
    //console.log(components) 
    return components
}