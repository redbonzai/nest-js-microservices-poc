import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CurrentUser } from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDocument } from '@app/common';
import { UsersService } from './users/users.service';
import { identifierToDTO } from '@app/common';
import { GetUserDto } from './users/dto/get-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDocument> {
    await this.authService.login(user, response);
    // response.send(user);
    const getUserDto: GetUserDto = await identifierToDTO(
      GetUserDto,
      user._id.toString(),
      '_id',
    );
    console.log('USER DTO RESPONSE: ', getUserDto);
    return this.usersService.getCurrentUser(getUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() payload: any) {
    console.log('PAYLOAD IN AUTHENTICATE: ', payload);
    return payload.user;
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (request.cookies?.Authentication || request.headers?.authentication) {
      const logoutResponse = await this.authService.logout(response);
      console.log('LOGOUT RESPONSE: ', logoutResponse);
    }
    return {
      message: 'success',
    };
  }
}
