import {NextApiRequest, NextApiResponse} from 'next'
import database from '../../database/database'
import bcrypt from 'bcryptjs'
import {sign} from 'jsonwebtoken'
import cookie from 'cookie'
import {ObjectID} from 'mongodb'

interface UserI {
    _id: ObjectID;
    username: string;
    email: string;
    password: string;
    image?: string;
}

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
    //console.log('HELLOOOO')
    if(req.method !== 'POST') {
        res.status(401).json({msg: 'Oops...'})
        return
    }
    const errors = []

    try {
        const db = await database()
        console.log(req.body.email)
        const user: UserI = await db.collection('users').findOne({'email': req.body.email})
        if(!user) {
            errors.push({msg: 'This email is not registered'})
            throw 'new error'
        }
        const match = await new Promise((resolve, reject) => {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) reject(err)
                resolve(result)
            })
        })
        if(!match) {
            errors.push({msg: 'Incorrect Password'})
            throw 'new error'
        }
        const claims = {
            _id: user._id,
            email: user.email,
            username: user.username,
            image: user.image
        }
        console.log('set claims...')
        console.log(process.env.SIGNATURE)
        const jwt = sign(claims, process.env.SIGNATURE, {expiresIn: '48hr'})
        console.log('jwt', jwt)

        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            // httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 172800,
            path: '/'
        }))
        res.status(200).json({msg: 'You are logged in'})
    } catch(e) {
        if(errors.length === 0) {
            errors.push(e)
            return res.status(500).json(errors)
        }
        res.status(409).json(errors)
    }
}