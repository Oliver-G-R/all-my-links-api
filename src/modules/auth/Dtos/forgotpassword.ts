import { IsEmail, IsNotEmpty } from 'class-validator'

export class forgotPasswordDto {
    @IsEmail({ message: 'This email is not valid' })
    @IsNotEmpty({ message: 'Email is required' })
  readonly email: string
}
