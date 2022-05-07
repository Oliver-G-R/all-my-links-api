import { User } from '../../user/schema/user.schema'
export interface ITokenResponse{
    token: string,
    user: User
}
