import database from '../database/database'
import {ObjectId} from 'mongodb'

export default async function createNewComponent(projectId:string, name:string, type:string) {
    try {
        const db = await database()
        const component:any = {
            project: new ObjectId(projectId),
            name: name,
            type: type
        }
        switch(type) {
            case 'data':
                component.data = []
                break
            case 'graphs':
                component.graphs = []
                break
            case 'sim+prob':
                component.diagrams = []
                component.tests = []
                break
            case 'confidenceIntervals':
                component.intervals = []
                break
            case 'hypothesisTests':
                component.tests = []
                break
            default:
                return null
        }
        const newComponent = await db.collection('components').insertOne(component)

        return JSON.parse(JSON.stringify(newComponent))
    } catch(e) {
        console.log(e)
        return null
    }
}