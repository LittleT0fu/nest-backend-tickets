import { Injectable } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Concert, ConcertDocument } from './schemas/concerts.schema';
import { Model } from 'mongoose';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectModel(Concert.name) private concertModel: Model<ConcertDocument>,
  ){}

  
  create(createConcertDto: CreateConcertDto) {
    return 'This action adds a new concert';
  }

  findAll() {
    return `This action returns all concerts`;
  }

  findOne(id: string) {
    return `This action returns a #${id} concert`;
  }

  update(id: string, updateConcertDto: UpdateConcertDto) {
    return `This action updates a #${id} concert`;
  }

  remove(id: string) {
    return `This action removes a #${id} concert`;
  }
}
