import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly description: string;
  @IsNumber()
  @IsNotEmpty()
  readonly seat: number;
}
