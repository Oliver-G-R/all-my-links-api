import { User } from '../modules/user/schema/user.schema'
import { ObjectId } from 'mongoose'
interface JWTPayload {
    nickName: string
    email:string
    id: ObjectId
}
interface JWTResponse{
    token: string,
    user: User
}

export {
  JWTPayload,
  JWTResponse
}
