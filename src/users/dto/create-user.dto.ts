import { IsEmail, IsString } from 'class-validator';

import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  image: string;
  pdf: Uint8Array;
}
