import { IsNotEmpty, IsString } from 'class-validator';

export class GetRoleDto {
  @IsString()
  @IsNotEmpty()
  _id: string;
}
