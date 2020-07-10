import {NextApiRequest, NextApiResponse} from 'next'
import database from '../../../database/database'
import {sign} from 'jsonwebtoken'
import cookie from 'cookie'
import {ObjectID, ObjectId} from 'mongodb'
import {verifyUser} from '../../../requests/verifyUser'

interface UserI {
    _id: ObjectID;
    username: string;
    email: string;
    password: string;
    image?: string;
    isVerified: boolean;
    premium: boolean;
}

export default verifyUser(async function AddPremium(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const db = await database()

        await db.collection('users').updateOne({'_id': new ObjectId(req.body.jwtUser._id)}, {
            '$set': {'premium': true}
        })

        // const user = req.body.jwtUser

        // const claims = {
        //     _id: user._id,
        //     email: user.email,
        //     username: user.username,
        //     image: user.image,
        //     premium: true
        // }

        // const jwt = sign(claims, process.env.SIGNATURE, {expiresIn: '48hr'})

        // res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
        //     // httpOnly: true,
        //     secure: process.env.NODE_ENV !== 'development',
        //     sameSite: 'strict',
        //     maxAge: 172800,
        //     path: '/'
        // }))

        return res.status(200).json({msg: 'Successfully added premium'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})