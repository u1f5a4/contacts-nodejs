import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  StreamableFile,
  Header,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiImage } from './user-image.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('pdf')
  async generatePdf(@Body() body: { email: string }) {
    return this.usersService.generatePdf(body.email);
  }

  @Get('pdf')
  @Header('Content-Type', 'application/pdf')
  async getPdf(@Body() body: { email: string }) {
    const pdf = await this.usersService.getPdf(body.email);
    return new StreamableFile(pdf);
  }

  @Post('image')
  @ApiImage()
  updateImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build(),
    )
    image: Express.Multer.File,
    @Body() body: { email: string },
  ) {
    return this.usersService.updateImage(body.email, image.path);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(email, updateUserDto);
  }

  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email);
  }
}
