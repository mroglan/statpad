import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'

export default async function UpdateProject(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        await db.collection('projects').updateOne({'_id': new ObjectId(req.body.id)}, {
            '$set': {
                'name': req.body.name,
                'description': req.body.description,
                'public': req.body.public
            }
        })

        return res.status(200).json({msg: 'Successful update'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}