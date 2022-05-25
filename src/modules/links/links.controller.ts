import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { LinksService } from './links.service'
import { LinkDto } from './dto/LinkDto'
import { ObjectId } from 'mongoose'
import { AuthGuard } from '@nestjs/passport'
import { Auth } from '@modules/auth/auth.decorator'
import { User } from '@modules/user/schema/user.schema'

@Controller('links')
export class LinksController {
  constructor (private readonly linksService:LinksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  getALlLInks (@Auth() { id }: User) {
    return this.linksService.getALlLInks(id)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  getLInkById (@Param('id') id:ObjectId) {
    return this.linksService.findById(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  createNewLink (@Body() body:LinkDto, @Auth() { id }: User) {
    return this.linksService.create(body, id)
  }
}
