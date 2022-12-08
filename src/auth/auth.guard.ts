import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')[1];
    if (!token) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const isValid = this.authService.validateJWT(token);
    if (!isValid) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return isValid;
  }
}
