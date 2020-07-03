import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'

export default async function DeleteProjects(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const ids = req.body.map(item => new ObjectId(item._id))

        await Promise.all([db.collection('projects').deleteMany({'_id': {'$in': ids}}), 
        db.collection('components').deleteMany({'project': {'$in': ids}})])

        return res.status(200).json({msg: 'Successfull deletion'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}