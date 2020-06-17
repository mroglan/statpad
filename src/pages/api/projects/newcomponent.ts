import database from '../../../database/database'
import {ObjectId} from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function createNewComponent(req:NextApiRequest, res:NextApiResponse) {
    try {
        const db = await database()
        const component:any = {
            project: new ObjectId(req.body.projectId),
            name: req.body.name,
            type: req.body.type,
            createDate: new Date(Date.now()),
            updateDate: new Date(Date.now())
        }
        switch(req.body.type) {
            case 'data':
                component.data = []
                break
            case 'graphs':
                component.graphs = []
                break
            case 'sim+prob':
                component.tests = []
                break
            case 'confidenceIntervals':
                component.intervals = []
                break
            case 'hypothesisTests':
                component.tests = []
                break
            default:
                throw 'new error'
        }
        const newComponent = await db.collection('components').insertOne(component)

        return res.status(200).json(newComponent)
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}