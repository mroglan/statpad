import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'

export default async function getGraphs(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const graphs = await db.collection('graphs').find({'component': new ObjectId(req.body._id)}).toArray()
        console.log(graphs)
        return res.status(200).json(graphs)
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}