import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../../requests/verifyUser'

export default verifyUser(async function UpdateTest(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        console.log(req.body.id)
        const db = await database()
        const updatedTest = await db.collection('tests').updateOne({'_id': new ObjectId(req.body.id)}, {
            '$set': {
                'data': req.body.data,
                'properties': req.body.properties
            }
        })
        res.status(200).json({msg: 'Successful update'})
    } catch(e) {
        console.log(e)
        res.status(500).json({msg: 'Internal Server Error'})
    }
})