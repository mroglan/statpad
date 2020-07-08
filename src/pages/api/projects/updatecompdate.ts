import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../requests/verifyUser'

export default verifyUser(async function UpdateCompDate(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        await db.collection('components').updateOne({'_id': new ObjectId(req.body.id)}, {
            '$set': {updateDate: new Date(Date.now())}
        })

        return res.status(200).json({msg: 'Updated update date'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error updating date'})
    }
})