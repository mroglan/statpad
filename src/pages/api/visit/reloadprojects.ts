import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'

export default async function ReloadProjects(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        const userId = req.body.userId ? new ObjectId(req.body.userId) : ''

        const projects = await db.collection('projects').aggregate([
            {'$sample': {
                'size': 5
            }}, {'$match': {
                'public': true,
                'editors': {
                    '$not': {
                        '$in': [userId]
                    }
                }
            }}
        ]).toArray()

        return res.status(200).json(projects)
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}