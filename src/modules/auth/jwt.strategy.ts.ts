import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../user/user.service'
import { JWTPayload } from '../../types/JWT'
import { User } from '@modules/user/schema/user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    @Inject(ConfigService) private configService:ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret')
    })
  }

  async validate (payload: JWTPayload):Promise<User> {
    const user = await this.userService.findById(payload.id)
    if (!user) throw new UnauthorizedException()

    return user
  }
}
