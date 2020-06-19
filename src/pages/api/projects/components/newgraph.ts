import { NextApiRequest, NextApiResponse } from "next";
import database from '../../../../database/database'
import {ObjectId} from 'mongodb'

export default async function NewGraph(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const graph = {...req.body, component: new ObjectId(req.body.component)}
        const newGraph = await db.collection('graphs').insertOne(graph)
        
        return res.status(200).json(newGraph)
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}