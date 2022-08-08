import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('all-my-links-api/v1')
  app.enableCors({
    origin: [
      'http://localhost:4000',
      'https://all-my-links-front.vercel.app/'
    ]
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
