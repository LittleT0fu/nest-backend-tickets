import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ReservationDto } from './dto/reservation-dto';

@Controller('concerts')
export class ConcertsController {
  // place a service in constructor to use it in the controller
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.create(createConcertDto);
  }

  @Get()
  findAll(@Body() Data) {
    return this.concertsService.findAll(Data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concertsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateConcertDto: UpdateConcertDto) {
  //   return this.concertsService.update(id, updateConcertDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concertsService.remove(id);
  }

  @Post(':id/reserve')
  reserveSeat(@Param('id') id: string, @Body() Data) {
    return this.concertsService.reserveSeat(id, Data.userName);
  }

  @Patch(':id/cancel')
  cancelReserve(@Param('id') id: string, @Body() Data) {
    console.log(id, Data);
    return this.concertsService.cancleReserve(id, Data.userName);
  }
}
