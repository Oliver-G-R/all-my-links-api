import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const connection = configService.get('database.connection');
        const host = configService.get('database.host');
        const dbName = configService.get('database.dbName');
        return {
          uri: `${connection}://${host}/${dbName}`,
          user: configService.get('database.user'),
          pass: configService.get('database.pass'),
          dbName,
          autoIndex: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DbModule {}
