import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'
import {verifyUser} from '../../../requests/verifyUser'

export default verifyUser(async function DeleteComponents(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    //console.log('user', req.body.jwtUser)

    try {
        const db = await database()
        const ids = req.body.deleteComps.map(item => new ObjectId(item._id))

        if(ids.length === 0) return res.status(200).json({msg: 'Nothing to delete'})

        const project = await db.collection('projects').findOne({'_id': new ObjectId(req.body.deleteComps[0].project)})

        if(!project) throw 'weird...'

        if(project.owner.toString() !== req.body.jwtUser._id) {
            return res.status(401).json({msg: 'YOU CANNOT PASS'})
        }

        await db.collection('components').deleteMany({'_id': {'$in': ids}})

        return res.status(200).json({msg: 'Successfully deleted'})
    } catch(e) {
        console.log(e)
        res.status(500).json({msg: 'Internal Server Error'})
    }
})

