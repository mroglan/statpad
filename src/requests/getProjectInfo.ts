import database from '../database/database'
import {ObjectId} from 'mongodb'

export default async function getProjectInfo(projectId:string) {
    const db = await database()
    console.log('projectId', projectId)
    const [project, updatedProject] = await Promise.all([
        db.collection('projects').aggregate([
            {
                '$match': {'_id': new ObjectId(projectId)}
            },
            {
                '$lookup': {
                    from: 'users',
                    localField: 'editors',
                    foreignField: '_id',
                    as: 'editorsInfo'
                }
            }
        ]).toArray(),
        db.collection('projects').updateOne({'_id': new ObjectId(projectId)}, {'$set': {'updateDate': new Date(Date.now())}})
    ])
    // const project = await db.collection('projects').aggregate([
    //     {
    //         '$match': {'_id': new ObjectId(projectId)}
    //     },
    //     {
    //         '$lookup': {
    //             from: 'users',
    //             localField: 'editors',
    //             foreignField: '_id',
    //             as: 'editorsInfo'
    //         }
    //     }
    // ]).toArray()
    project[0].editorsInfo = project[0].editorsInfo.map(editor => ({_id: editor._id, username: editor.username}))
    console.log(project)
    //project[0].editorsInfo.forEach(editor => console.log(editor))
    return project[0]
}