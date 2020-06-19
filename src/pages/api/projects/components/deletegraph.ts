import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'

export default async function DeleteGraph(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        await db.collection('graphs').remove({'_id': new ObjectId(req.body)})

        return res.status(200).json({msg: 'Successful deletion'})
    } catch(e) {
        return res.status(500).json({msg: 'Internal server error'})
    }
}