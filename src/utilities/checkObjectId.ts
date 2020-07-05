import {ObjectId} from 'mongodb'

export default function checkObjectId(id:string) {
    if(!ObjectId.isValid(id)) return false
    if(String(new ObjectId(id)) !== id) return false
    return true
}