import {NextApiRequest, NextApiResponse} from 'next'
import {sign} from 'jsonwebtoken'
import cookie from 'cookie'
import {verifyUser} from '../../../requests/verifyUser'

export default verifyUser(async function AddPremiumToJWT(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    try {
        const user = req.body.jwtUser

        const claims = {
            _id: user._id,
            email: user.email,
            username: user.username,
            image: user.image,
            premium: true
        }

        const jwt = sign(claims, process.env.SIGNATURE, {expiresIn: '48hr'})

        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            // httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 172800,
            path: '/'
        }))

        return res.status(200).json({msg: 'Successful addition of premium to jwt'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})
