import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../requests/verifyUser'

export default verifyUser(async function LeaveProjects(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    //console.log('user', req.body.jwtUser)

    try {
        const db = await database()
        const userId = new ObjectId(req.body.userId)
        const projectIds = req.body.leaving.map(proj => new ObjectId(proj._id))

        if(projectIds.length === 0) return res.status(200).json({msg: 'Nothing to delete'})

        const project = await db.collection('projects').findOne({'_id': projectIds[0]})
        if(!project) throw 'weird...'

        if(!project.editors.find(editor => editor.toString() === req.body.jwtUser._id)) {
            return res.status(401).json({msg: 'YOU CANNOT PASS'})
        }

        await db.collection('projects').updateMany({'_id': {
            '$in': projectIds
        }}, {
            '$pull': {
                'editors': userId
            }
        })

        return res.status(200).json({msg: 'Successful update'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})