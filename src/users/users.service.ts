import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
