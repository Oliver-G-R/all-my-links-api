import { registerAs } from '@nestjs/config'
export default registerAs('gmail', () => ({
  mail: process.env.GMAIL_MAIL,
  pass: process.env.GMAIL_PASSWORD
}))
