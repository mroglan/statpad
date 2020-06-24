import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'

export default async function GetIntervals(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const intervals = await db.collection('intervals').find({'component': new ObjectId(req.body._id)}).toArray()

        return res.status(200).json(intervals)
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}