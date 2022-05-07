import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class SignUpDto {
  @IsString()
  @IsNotEmpty({ message: 'Nickname is required' })
  readonly nickName: string

  @IsEmail({}, { message: 'This email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string
}
