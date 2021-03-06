import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('all-my-links-api/v1')
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(4000)
}
bootstrap()
