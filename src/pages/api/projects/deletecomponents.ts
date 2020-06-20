import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'

export default async function DeleteComponents(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const ids = req.body.map(item => new ObjectId(item._id))

        await db.collection('components').deleteMany({'_id': {'$in': ids}})

        return res.status(200).json({msg: 'Successfully deleted'})
    } catch(e) {
        console.log(e)
        res.status(500).json({msg: 'Internal Server Error'})
    }
}

