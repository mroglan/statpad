import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'

export default async function NewInterval(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {  
        const db = await database()
        const interval = {...req.body, component: new ObjectId(req.body.component)}
        const newInterval = await db.collection('intervals').insertOne(interval)

        return res.status(200).json(newInterval.ops[0])
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}