import {NextApiRequest, NextApiResponse} from 'next'
import {verify} from 'jsonwebtoken'

export default async function findUser(req: NextApiRequest, res: NextApiResponse) {
    verify(req.cookies.auth, process.env.SIGNATURE, async (err, decoded) => {
        if(!err && decoded) {
            return res.json(decoded)
        }

        res.status(401).json({msg: 'Not Authenticated'})
    })
}