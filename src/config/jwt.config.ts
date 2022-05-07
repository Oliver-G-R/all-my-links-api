import { registerAs } from '@nestjs/config'
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || '12323',
  expiresIn: process.env.EXPIRES_IN || '2d'
}))
