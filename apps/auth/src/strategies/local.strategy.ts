import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // can override with separate parameter 'local'
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
      // passwordField: 'password'
    });
  }

  async validate(email: string, password: string) {
    try {
      return this.usersService.verifyUser(email, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
