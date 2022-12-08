import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as PDFDocument from 'pdfkit';
import * as fs from 'node:fs/promises';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const findUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (findUser)
      throw new Error('[create] A user with this email already exists');

    return this.usersRepository.save({ ...createUserDto });
  }

  async getUser(email: string) {
    return this.return(await this.findOne(email));
  }

  async generatePdf(email: string) {
    try {
      const findUser = await this.findOne(email);
      const { firstName, lastName, image } = findUser;

      const pdfBuffer: Buffer = await new Promise((resolve) => {
        const doc = new PDFDocument({
          margins: { right: 72, left: 72, top: 50, bottom: 50 },
          size: 'A4',
        });
        doc.fontSize(16);

        doc.text(`First name: ${firstName}`);
        doc.text(`Last name: ${lastName}`);
        if (image) doc.image(image, { width: 200 });

        const buffer = [];
        doc.on('data', buffer.push.bind(buffer));
        doc.on('end', () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });

        doc.end();
      });

      const uint8array = new Uint8Array(pdfBuffer);
      this.update(email, { pdf: uint8array });
      return { pdf: true };
    } catch (e) {
      return { pdf: false };
    }
  }

  async getPdf(email: string) {
    const findUser = await this.usersRepository.findOne({
      where: { email: email },
    });
    return findUser.pdf;
  }

  // for internal use only
  async findOne(email: string) {
    const findUser = await this.usersRepository.findOne({
      where: { email: email },
    });
    return findUser;
  }

  async return(user: UpdateUserDto) {
    delete user.password;
    return { ...user, pdf: Boolean(user.pdf) };
  }

  async update(email: string, updateUserDto: Partial<UpdateUserDto>) {
    const findUser = await this.findOne(email);
    const isUpdate =
      (
        await this.usersRepository.update(email, {
          ...findUser,
          ...updateUserDto,
        } as UpdateUserDto)
      ).affected === 1;
    if (isUpdate) return this.return(Object.assign(findUser, updateUserDto));
    else throw new Error('[update] error update user');
  }

  async updateImage(email: string, image: string) {
    const user = await this.findOne(email);
    const oldImage = user.image;
    if (oldImage && oldImage !== image) await fs.rm(oldImage);

    return await this.update(email, { image });
  }

  async remove(email: string) {
    const user = await this.findOne(email);
    const oldImage = user.image;
    if (oldImage) await fs.rm(oldImage);

    const { affected } = await this.usersRepository.delete({ email });
    return { delete: affected === 1 };
  }
}
