import database from '../../../database/database'
import {ObjectId} from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import {verifyUser} from '../../../requests/verifyUser'

export default verifyUser(async function AddEditor(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.json({msg: 'Oops...'})
    }

    //console.log('user', req.body.jwtUser)

    const errors = []
    try {
        const db = await database()
        const [editors, currentProject] = await Promise.all([
            db.collection('users').find({'username': {'$in': req.body.newEditors}}).toArray(),
            db.collection('projects').findOne({'_id': new ObjectId(req.body.projectId)})
        ])

        if(currentProject.owner.toString() !== req.body.jwtUser._id) {
            return res.status(401).json({msg: 'YOU CANNOT PASS'})
        }
        
        if(editors.length < req.body.newEditors.length) {
            const notIncluded = req.body.newEditors.reduce((notFoundEditors, editor) => {
                if(editors.find(el => el.username === editor)) return notFoundEditors
                notFoundEditors.push(editor)
                return notFoundEditors
            }, [])
            console.log('notIncluded', notIncluded)
            errors.push({msg: `Could not find users ${notIncluded.join(', ')}`})
            throw 'some users not found'
        }

        const newIds = editors.map(editor => editor._id)
        const prevIds = req.body.currentEditors.map(editor => new ObjectId(editor._id))

        await db.collection('projects').updateOne({'_id': new ObjectId(req.body.projectId)}, {
            '$set': {
                'editors': [...prevIds, ...newIds]
            }
        })

        const filteredEditors = editors.map(editor => ({_id: editor._id, username: editor.username, image: editor.image}))

        return res.status(200).json(filteredEditors)
    } catch(e) {
        if(errors.length === 0) {
            return res.status(500).json([{msg: 'Internal Server Error'}])
        }
        console.log(errors)
        res.status(500).json(errors)
    }
})