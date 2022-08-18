import { PartialType } from '@nestjs/mapped-types'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class UserDto {
  @IsEmail({ message: 'This email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string

  @IsString()
  @MaxLength(20, { message: 'Password is too long, max length is 20' })
  @MinLength(8, { message: 'Password is too short, min length is 8' })
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
