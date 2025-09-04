import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly description: string;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly seat: number;
}
