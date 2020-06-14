import {NextApiRequest, NextApiResponse} from 'next'
import database from '../../database/database'
import bcrypt from 'bcryptjs'

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
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        }
        const newUser = await db.collection('users').insertOne(user)
        console.log('inserted new user')
        res.status(200).json({msg: 'Success'})
    } catch(e) {
        if(errors.length === 0) {
            errors.push({msg: 'Internal Server Error'})
            return res.status(500).json(errors)
        } else {
            res.status(409).json(errors)
        }
    }
}