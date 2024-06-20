import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument } from '@app/common';
import { CreatedUserValidationException } from './exceptions/created-user-validation.exception';
import { ErrorType } from '@app/common/enums';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.userExists(createUserDto)) {
      throw new CreatedUserValidationException(
        'User already exists',
        ErrorType.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async getCurrentUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  async update(_id: GetUserDto, userDto: UpdateUserDto): Promise<UserDocument> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }

    // Perform the update
    return await this.usersRepository.findOneAndUpdate(
      { _id },
      { $set: userDto },
    );
  }

  private async userExists(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      email: createUserDto.email,
    });

    return Object(user).length > 0;
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async addReservationToUser(userId: string, resId: string): Promise<void> {
    return await this.usersRepository.addReservationToUser(userId, resId);
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    return await this.usersRepository.getUserPermissions(userId);
  }

  async getUserRolesAndPermissions(userId: string): Promise<string[]> {
    return await this.usersRepository.getUserRolesAndPermissions(userId);
  }
}
