import { registerAs } from '@nestjs/config'
export default registerAs('front', () => ({
  verifyUrl: process.env.URL_VERIFICATION_TOKEN,
  resetPasswordUrl: process.env.URL_RESET_PASSWORD_TOKEN
}))
