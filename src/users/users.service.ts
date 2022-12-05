import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as PDFDocument from 'pdfkit';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    const { email, firstName, lastName } = createUserDto;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;

    return this.usersRepository.save(user);
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
    } catch {
      return { pdf: false };
    }
  }

  async getPdf(email: string) {
    return (await this.findOne(email)).pdf;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(email: string) {
    const findUser = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!findUser) throw new Error('not found user');
    return findUser;
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const findUser = await this.findOne(email);
    const isUpdate =
      (await this.usersRepository.update(email, updateUserDto)).affected === 1;
    if (isUpdate) return Object.assign(findUser, updateUserDto);
  }

  updateImage(email: string, image: string) {
    return this.update(email, { image });
  }

  async remove(email: string) {
    const findUser = await this.findOne(email);
    return this.usersRepository.remove(findUser);
  }
}
