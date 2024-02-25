import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from '@app/common';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UpdateUserDto } from '@auth/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);
    console.log('TOKEN IN AUTH.SERVICE: ', token);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return token;
  }

  async logout(response: Response): Promise<{ message: string }> {
    response.clearCookie('Authentication');
    return {
      message: 'Authentication successfully cleared',
    };
  }
}
