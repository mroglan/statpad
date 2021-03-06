import {NextApiRequest, NextApiResponse} from 'next'
import database from '../../../database/database'
import {verifyUser} from '../../../requests/verifyUser'
import {ObjectId} from 'mongodb'

export default verifyUser(async function RemovePremium(req:NextApiRequest, res:NextApiResponse) {
    
    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()

        await db.collection('users').updateOne({'_id': new ObjectId(req.body.jwtUser._id)}, {
            '$set': {'premium': false}
        })

        return res.status(200).json({msg: 'Successfully removed premium'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})