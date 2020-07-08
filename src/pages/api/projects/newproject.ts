import database from '../../../database/database'
import { NextApiRequest, NextApiResponse } from 'next';
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../requests/verifyUser'

export default verifyUser(async function NewProject(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {

        if(req.body.owner !== req.body.jwtUser._id) {
            return res.status(401).json({msg: 'YOU CANNOT PASS'})
        }

        const db = await database()

        const project = {
            owner: new ObjectId(req.body.owner),
            editors: [new ObjectId(req.body.owner)],
            name: req.body.name,
            createDate: new Date(Date.now()),
            updateDate: new Date(Date.now()),
            description: req.body.description,
            public: req.body.public
        }

        const newProject = await db.collection('projects').insertOne(project)
        //console.log(newProject)
        return res.status(200).json(newProject.ops[0]._id)
    } catch(e) {
        console.log(e)
        return res.status(500).json([{msg: 'Internal Server Error'}])
    }
})