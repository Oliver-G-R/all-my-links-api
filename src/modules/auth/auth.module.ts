import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { JwtStrategy } from './jwt.strategy.ts'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UserSchema } from '@modules/user/schema/user.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  imports: [
    UserModule,
    PassportModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          secure: false,
          auth: {
            user: configService.get('gmail.mail'),
            pass: configService.get('gmail.pass')
          }
        },
        defaults: {
          from: `"No reply" <${configService.get('gmail.mail')}>`
        }
      })
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.expiresIn')
          }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
