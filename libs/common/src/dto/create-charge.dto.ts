import Stripe from 'stripe';
import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CardDto } from '@app/common';

export class CreateChargeDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @IsNumber()
  amount: number;
}
