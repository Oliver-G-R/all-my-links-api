import { JWTPayload } from '../../types/JWT'
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common'

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<JWTPayload> => {
    try {
      const request = ctx.switchToHttp().getRequest()
      return request.user
    } catch (error) {
      throw new ForbiddenException()
    }
  }
)
