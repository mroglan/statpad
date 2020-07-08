import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import {verify} from 'jsonwebtoken'

export const verifyUser = (fn:NextApiHandler) => (req:NextApiRequest, res:NextApiResponse) => {
    return new Promise(resolve => {
        verify(req.cookies.auth, process.env.SIGNATURE, async (err, decoded) => {
            if(!err && decoded) {
                req.body.jwtUser = decoded
                await fn(req, res)
                return resolve()
            }
    
            res.status(401).json({message: 'Sorry, you are not authenticated'})
            return resolve()
        })
    })
}