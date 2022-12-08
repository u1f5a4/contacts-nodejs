import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const salt = Number(this.configService.get('SALT_PASSWORD'));
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    return { jwt: this.jwtService.sign({ email: newUser.email }) };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const findUser = await this.usersService.findOne(email);
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (isMatch)
      return { jwt: this.jwtService.sign({ email: findUser.email }) };
    else throw new Error('[login] wrong password');
  }

  validateJWT(token: string) {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}
