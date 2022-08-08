import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 27017,
  dbName: process.env.DB_NAME || 'all_my_links',
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  connection: process.env.DB_CONNECTION || 'mongodb'
}))
