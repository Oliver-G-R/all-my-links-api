import { PartialType } from '@nestjs/mapped-types'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

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

  @IsString()
  @IsNotEmpty()
  readonly fullName: string

  @IsString()
  @IsOptional()
  readonly bio:string
}

export class UpdateUserDto extends PartialType(UserDto) {}
