import database from '../../../database/database'
import { NextApiRequest, NextApiResponse } from 'next';
import {ObjectId} from 'mongodb'

export default async function NewProject(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        res.send('oops...')
        return
    }

    try {

        const db:any = await database()

        const project = {
            owner: new ObjectId(req.body.owner),
            editors: [new ObjectId(req.body.owner)],
            name: req.body.name,
            createDate: new Date(Date.now()),
            updateDate: new Date(Date.now()),
            description: req.body.description
        }

        const newProject = await db.collection('projects').insertOne(project)
        //console.log(newProject)
        res.status(200).json(newProject.ops[0]._id)
    } catch(e) {
        console.log(e)
        return res.status(500).json([{msg: 'Internal Server Error'}])
    }
}