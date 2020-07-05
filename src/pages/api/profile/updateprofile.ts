import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../database/database";
import {ObjectId} from 'mongodb'
import {sign} from 'jsonwebtoken'
import cookie from 'cookie'

export default async function UpdateProfile(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    const errors = []

    try {
        const db = await database()

        const sameNameUser = await db.collection('users').findOne({'username': req.body.username})

        if(sameNameUser && sameNameUser._id.toString() !== req.body.id) {
            errors.push('Username already in use!')
            throw 'error'
        }

        const sameEmailUser = await db.collection('users').findOne({'email': req.body.email})

        if(sameEmailUser && sameEmailUser._id.toString() !== req.body.id) {
            errors.push('Email already in use!')
            throw 'error'
        }

        await db.collection('users').updateOne({'_id': new ObjectId(req.body.id)}, {
            '$set': {
                'username': req.body.username,
                'email': req.body.email, 
                'image': req.body.image
            }
        })

        const claims = {
            _id: req.body.id,
            email: req.body.email,
            username: req.body.username,
            image: req.body.image
        }

        const jwt = sign(claims, process.env.SIGNATURE, {expiresIn: '48hr'})

        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 172800,
            path: '/'
        }))

        return res.status(200).json({msg: 'Successful'})
    } catch(e) {
        if(errors.length === 0) return res.status(500).json(['Internal Server Error'])
        return res.status(500).json(errors)
    }
}