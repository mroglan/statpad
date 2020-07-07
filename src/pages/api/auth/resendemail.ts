import {NextApiRequest, NextApiResponse} from 'next'
import database from '../../../database/database'
import crypto from 'crypto'
import sendEmail from '../../../utilities/sendEmail'

export default async function ResendEmail(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    const errors = []

    try {
        const db = await database()

        const user = await db.collection('users').findOne({'email': req.body})
        if(!user) {
            errors.push({msg: 'This email is not registered'})
            throw 'new error'
        }
        if(user.isVerified) {
            errors.push({msg: 'This email is already verified'})
            throw 'new error'
        }
        //const prevToken = await db.collection('verificationTokens').findOne({'userId': user._id})
        
        const [randomToken, deletePrevToken] = await Promise.all([
            new Promise((resolve, reject) => {
                crypto.randomBytes(48, (err, buffer) => {
                    if(err) {
                        return reject(err)
                    }
                    return resolve(buffer.toString('hex'))
                })
            }), db.collection('verificationTokens').deleteOne({'userId': user._id})
        ])

        await db.collection('verificationTokens').insertOne({
            userId: user._id,
            token: randomToken,
            createdAt: new Date(Date.now())
        })

        await sendEmail({name: user.username, email: user.email, 
            link: `${process.env.BASE_ROUTE}/auth/confirmemail/${randomToken}`})

        return res.status(200).json({msg: 'Successfully resent confirmation'})
    } catch(e) {
        if(errors.length === 0) {
            console.log(e)
            return res.status(500).json([{msg: 'Internal Server Error'}])
        }
        return res.status(500).json(errors)
    }
}