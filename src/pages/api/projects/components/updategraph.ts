import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'

export default async function UpdateGraph(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const updatedGraph = await db.collection('graphs').updateOne({'_id': new ObjectId(req.body.id)}, {
            '$set': {
                'properties': req.body.properties,
                'charts': req.body.charts
            }
        })
        return res.status(200).json({msg: 'Update Success'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}