import { IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string

  @IsString()
  readonly nickNameOrEmail: string
}
