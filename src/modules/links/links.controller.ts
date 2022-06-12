import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common'
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

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  removeLink (@Param('id') id:ObjectId) {
    return this.linksService.remove(id)
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  updateLink (@Param('id') id:ObjectId, @Body() body:LinkDto) {
    return this.linksService.update(id, body)
  }
}
