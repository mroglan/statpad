import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../requests/verifyUser'

export default verifyUser(async function UpdateComponent(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()

        const project = await db.collection('projects').findOne({'_id': new ObjectId(req.body.projectId)})
        if(!project) throw 'weird...'

        if(!project.editors.find(editor => editor.toString() === req.body.jwtUser._id)) {
            return res.status(401).json({msg: 'YOU CANNOT PASS'})
        }

        await db.collection('components').updateOne({'_id': new ObjectId(req.body.id)}, {
            '$set': {'data': req.body.data, 'updateDate': new Date(Date.now())}
        })
        return res.status(200).json({msg: 'Successfully updated'})

        throw 'new error'
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal ServerError'})
    }
})