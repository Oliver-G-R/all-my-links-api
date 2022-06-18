import { IsNotEmpty, IsString } from 'class-validator'
export class LinkDto {
    @IsNotEmpty()
    @IsString()
      titleLink: string

    @IsNotEmpty()
    @IsString()
      link: string

    @IsNotEmpty()
    @IsString()
      socialIcon: string
}
