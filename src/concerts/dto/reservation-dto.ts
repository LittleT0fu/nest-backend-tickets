import { IsString, IsNotEmpty } from 'class-validator';

export class ReservationDto {
  @IsString()
  @IsNotEmpty()
  readonly userName: string;
}
