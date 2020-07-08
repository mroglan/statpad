import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../requests/verifyUser'

export default verifyUser(async function RemoveEditors(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const ids = req.body.remaining.map(editor => new ObjectId(editor._id))

        const project = await db.collection('projects').findOne({'_id': new ObjectId(req.body.projectId)})
        if(!project) throw 'weird...'

        if(project.owner.toString() !== req.body.jwtUser._id) {
            return res.status(401).json({msg: 'YOU CANNOT PASS'})
        }

        await db.collection('projects').updateOne({'_id': new ObjectId(req.body.projectId)}, {
            '$set': {
                'editors': ids
            }
        })

        return res.status(200).json({msg: 'Successful removal'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})