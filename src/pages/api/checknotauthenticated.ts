import {NextApiRequest, NextApiResponse} from 'next'

export default function checkNotAuthenticated(req: NextApiRequest, res: NextApiResponse) {
    if(req.cookies.auth) {
        res.status(401).json({msg: 'You are logged in already'})
    } else {
        res.status(200).json({msg: 'Proceed...'})
    }
}