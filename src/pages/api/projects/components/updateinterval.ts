import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../../requests/verifyUser'

export default verifyUser(async function UpdateInterval(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        await db.collection('intervals').updateOne({'_id': new ObjectId(req.body.id)}, {
            '$set': {
                'properties': req.body.properties
            }
        })
        return res.status(200).json({msg: 'Update successfull'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})