import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { JwtAuthGuard } from '@app/common/auth';
import { CurrentUser, Roles, UserDto } from '@app/common';
import { UsersService } from 'apps/auth/src/users/users.service';
import { ReservationDocument } from './models/reservation.schema';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ): Promise<ReservationDocument> {
    console.log('REQUEST BODY FOR CREATED RESERVATION : ', user);
    return await this.reservationsService.create(createReservationDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async findAll() {
    return await this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async remove(@Param('id') id: string) {
    return await this.reservationsService.remove(id);
  }
}
