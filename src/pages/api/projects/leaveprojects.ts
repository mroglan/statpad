import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'

export default async function LeaveProjects(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const userId = new ObjectId(req.body.userId)
        const projectIds = req.body.leaving.map(proj => new ObjectId(proj._id))

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
}