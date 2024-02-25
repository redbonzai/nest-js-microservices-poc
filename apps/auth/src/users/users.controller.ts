import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser, identifierToDTO, Roles } from '@app/common';
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';
import { UserDocument } from '@auth/users/models';
import { UsersService } from './users.service';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from '@auth/users/dto/update-user.dto';
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('REQUEST BODY FOR CREATED RESERVATION : ', createUserDto);
    await this.usersService.validateCreateUser(createUserDto);
    return this.usersService.create(createUserDto);
  }

  // @Post('role')
  // async addRole(@Body() body: any) {
  //   return this.usersService.addRole(body.userId, body.roleId);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() user: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersService.update(
      await identifierToDTO(GetUserDto, id, '_id'),
      user,
    );
  }

  @Patch(':id/roles')
  async updateUserRoles(
    @Param('id') id: string,
    @Body() userId: Types.ObjectId,
    roleNames: string[],
  ): Promise<UserDocument> {
    return this.usersService.updateUserRoles(userId, roleNames);
  }

  @Patch(':id/permissions')
  async updateUserPermissions(
    @Param('id') id: string,
    @Body() userId: Types.ObjectId,
    roleId: Types.ObjectId,
    permissions: string[],
  ): Promise<UserDocument> {
    return this.usersService.updateUserPermissions(userId, roleId, permissions);
  }
}
