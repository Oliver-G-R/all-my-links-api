import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Global()
@Module({
  imports: [

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const connection = configService.get<string>('database.connection')
        const host = configService.get<string>('database.host')
        const port = configService.get<number>('database.port')
        const dbName = configService.get<string>('database.dbName')
        const user = configService.get<string>('database.user')
        const password = configService.get<string>('database.pass')

        const uriDev = `${connection}://${host}:${port}`
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
