import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationsRepository } from './reservations.repository';
import { AbstractDocument, PAYMENTS_SERVICE, UserDto } from '@app/common';

import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { ReservationCreationException } from './exceptions/reservation-creation.exception';
import { ErrorType } from '@app/common/enums';
import { Reservation } from './interfaces/reservation.interface';
import { ReservationDocument } from './models/reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly userRepository: UsersRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ): Promise<any> {
    try {
      // Convert the Observable to a Promise to await its result
      const stripeResponse = await firstValueFrom(
        this.paymentsService.send('create_charge', {
          ...createReservationDto.charge,
          email,
        }),
      );

      // Now create the reservation after getting the response
      const reservation = await this.reservationsRepository.create({
        ...createReservationDto,
        invoiceId: stripeResponse.id,
        description: 'Visit to yer moms house',
        timestamp: new Date(),
        userId,
      });

      await this.userRepository.addReservationToUser(
        userId,
        reservation._id.toString(),
      );

      // return reservation and user response
      return await this.reservationsRepository.getUserReservation(
        reservation._id.toString(),
      );
    } catch (error) {
      console.log('ERROR CREATING A RESERVATION: ', error);
      throw new ReservationCreationException(
        ErrorType.RESERVATION_CREATION_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return this.reservationsRepository.allReservationsWithUsers();
  }

  async findOne(_id: string): Promise<ReservationDocument> {
    const reservation: AbstractDocument =
      await this.reservationsRepository.findOne({
        _id,
      });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${_id} not found`);
    }

    return await this.reservationsRepository.getUserReservation(_id);
  }

  async update(
    _id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationDocument> {
    const reservation = await this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${_id} not found`);
    }

    return await this.reservationsRepository.getUserReservation(_id);
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
