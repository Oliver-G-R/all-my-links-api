import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const connection = configService.get('database.connection')
        const host = configService.get('database.host')
        const port = configService.get('database.port')
        const dbName = configService.get('database.dbName')
        const user = configService.get('database.user')
        const password = configService.get('database.pass')
        const uriDev = `mongodb://${host}:${port}`
        const uriProd = `${connection}://${user}:${password}@${dbName}.${host}/`
        return {
          uri: process.env.NODE_ENV === 'development' ? uriDev : uriProd
        }
      },
      inject: [ConfigService]
    })
  ],
  exports: [MongooseModule]
})
export class DbModule {}
