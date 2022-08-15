import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/user/user.module'
import { DbModule } from '@modules/db/db.module'
import { LinksModule } from '@modules/links/links.module'
import { ConfigModule } from '@nestjs/config'
import { cloudinaryConfig, dbConfig, jwtConfig, gmailConfig, frontConfig } from '@config/index'

const ENV = process.env.NODE_ENV
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV === 'development' ? '.dev.env' : '.prod.env',
      cache: true,
      isGlobal: true,
      load: [dbConfig, jwtConfig, cloudinaryConfig, gmailConfig, frontConfig]
    }),
    AuthModule,
    UserModule,
    LinksModule,
    DbModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
