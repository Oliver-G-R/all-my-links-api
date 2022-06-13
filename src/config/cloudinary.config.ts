import { registerAs } from '@nestjs/config'

export default registerAs('cloudinary', () => ({
  cloud_name: process.env.CLDY_DB_NAME,
  api_key: process.env.CLDY_APY_KEY,
  api_secret: process.env.CLDY_API_SECRET
}))
