import { IsNotEmpty, IsString } from 'class-validator'
import { SignInDto } from './signIn.dto'

export class SignUpDto extends SignInDto {
  @IsString()
  @IsNotEmpty({ message: 'Nickname is required' })
  readonly nickname: string
}
