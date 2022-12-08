import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  StreamableFile,
  Header,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiImage } from './user-image.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Payload, PayloadType } from 'src/auth/payload.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Payload() payload: PayloadType) {
    return this.usersService.getUser(payload.email);
  }

  @Post('pdf')
  @UseGuards(AuthGuard)
  async generatePdf(@Body() body: { email: string }) {
    return this.usersService.generatePdf(body.email);
  }

  @Get('pdf')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/pdf')
  async getPdf(@Body() body: { email: string }) {
    const pdf = await this.usersService.getPdf(body.email);
    if (!pdf) throw new Error('[getPdf] pdf not found');
    return new StreamableFile(pdf);
  }

  @Post('image')
  @UseGuards(AuthGuard)
  @ApiImage()
  updateImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build(),
    )
    image: Express.Multer.File,
    @Payload() payload: PayloadType,
  ) {
    return this.usersService.updateImage(payload.email, image.path);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(
    @Payload() payload: PayloadType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(payload.email, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  remove(@Payload() payload: PayloadType) {
    return this.usersService.remove(payload.email);
  }
}
