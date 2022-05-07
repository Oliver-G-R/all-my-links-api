import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { LinksService } from './links.service'
import { LinkDto } from './dto/LinkDto'
import { ObjectId } from 'mongoose'

@Controller('links')
export class LinksController {
  constructor (private readonly linksService:LinksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getALlLInks () {
    return this.linksService.getALlLInks()
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getLInkById (@Param('id') id:ObjectId) {
    return this.linksService.findById(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createNewLink (@Body() body:LinkDto) {
    return this.linksService.create(body)
  }
}
