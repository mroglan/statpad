import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'


export default async function UpdateComponent(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()
        //const component = await db.collection('components').findOne({_id: new ObjectId(req.body.id)})
        //console.log('component', component)
        if(req.body.type === 'data') {
            //console.log('type is data')
            console.log(req.body.data)
            await db.collection('components').updateOne({'_id': new ObjectId(req.body.id)}, {
                '$set': {'data': req.body.data, 'updateDate': new Date(Date.now())}
            })
            return res.status(200).json({msg: 'Successfully updated'})
        }

        throw 'new error'
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal ServerError'})
    }
}