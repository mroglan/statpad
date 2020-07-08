import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../../requests/verifyUser'

export default verifyUser(async function DeleteGraph(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()

        //console.log(req.body)

        const project = await db.collection('projects').findOne({'_id': new ObjectId(req.body.projectId)})
        if(!project) throw 'weird...'

        if(!project.editors.find(editor => editor.toString() === req.body.jwtUser._id)) {
            return res.status(401).json({msg: 'YOU CANNOT PASS'})
        }

        await db.collection('graphs').remove({'_id': new ObjectId(req.body.graphId)})

        return res.status(200).json({msg: 'Successful deletion'})
    } catch(e) {
        return res.status(500).json({msg: 'Internal server error'})
    }
})