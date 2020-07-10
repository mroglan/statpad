import {NextApiRequest, NextApiResponse} from 'next'
import database from '../../database/database'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import sendEmail from '../../utilities/sendEmail'

export default async function signUp(req: NextApiRequest, res: NextApiResponse) {
    //console.log(req.body)
    if(req.method !== 'POST') {
        res.send('oops...')
        return
    }
    const db:any = await database()
    
    const errors = []
    try {

        const users = await db.collection('users').find({}).toArray()

        if(users.find(user => user.email === req.body.email)) {
            errors.push({msg: 'This email is already registered'})
            throw 'new error'
        }

        if(users.find(user => user.username === req.body.username)) {
            errors.push({msg: 'This username is already in use'})
            throw 'new error'
        }

        if(req.body.password !== req.body.passwordConfirmation) {
            errors.push({msg: 'Passwords do not match'})
            throw 'new error'
        }

        const hashedPassword = await new Promise((res, rej) => {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                //console.log('password shoud be hashed')
                if(err) rej(err)
                res(hash)
            })
        })
        //console.log('successfully hashed password')
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            isVerified: false,
            premium: false
        }
        const newUser = await db.collection('users').insertOne(user)

        const randomToken = await new Promise((res, rej) => {
            crypto.randomBytes(48, (err, buffer) => {
                if(err) {
                    return rej(err)
                }
                return res(buffer.toString('hex'))
            })
        })
        //console.log(randomToken)
        //console.log(newUser)

        await db.collection('verificationTokens').insertOne({
            userId: newUser.ops[0]._id,
            token: randomToken,
            createdAt: new Date(Date.now())
        })

        await sendEmail({name: req.body.username, email: req.body.email, 
            link: `${process.env.BASE_ROUTE}/auth/confirmemail/${randomToken}`})

        res.status(200).json({msg: 'Success'})
    } catch(e) {
        if(errors.length === 0) {
            console.log(e)
            errors.push({msg: 'Internal Server Error'})
            return res.status(500).json(errors)
        } else {
            res.status(409).json(errors)
        }
    }
}