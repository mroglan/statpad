import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'

export default async function RemoveEditors(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const ids = req.body.remaining.map(editor => new ObjectId(editor._id))

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
}