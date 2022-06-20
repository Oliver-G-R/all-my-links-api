import { OmitType } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserDto {
  @IsEmail({ message: 'This email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string

  @IsString()
  @IsNotEmpty({ message: 'Nickname is required' })
  readonly nickName: string
}

export class UpdateUserDto extends OmitType(UserDto, ['password'] as const) {}
