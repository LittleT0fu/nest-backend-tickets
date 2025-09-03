import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ReservationDto } from './dto/reservation-dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Concert, ConcertDocument } from './schemas/concerts.schema';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectModel(Concert.name) private concertModel: Model<ConcertDocument>,
  ) {}

  async create(createConcertDto: CreateConcertDto): Promise<Concert> {
    const result = new this.concertModel(createConcertDto);
    return result.save();
  }

  async findAll(): Promise<Concert[]> {
    return this.concertModel.find().exec();
  }

  async findOne(id: string) {
    //check id is valid object id
    if (!Types.ObjectId.isValid(id)) {
      return { message: 'id not found' };
    }
    return this.concertModel.findById(id).exec();
  }

  async remove(id: string) {
    try {
      //check valid id
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException('id not found');
      }
      const result = await this.concertModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('id not found');
      }
      return { message: 'delete success' };
    } catch (error) {
      throw error;
    }
  }

  async reserveSeat(
    concertId: string,
    reservation: ReservationDto,
  ): Promise<Concert | null> {
    console.log(concertId);
    return this.concertModel.findByIdAndUpdate(
      concertId,
      { $push: { reserved: reservation } },
      { new: true },
    );
  }

  // async cacncleReserve(
  //   concertId: string,
  //   reservation: {
  //     userName: string;
  //     concertName: string;
  //     action: 'cancel';
  //   },
  // ): Promise<Concert | null> {
  //   return this.concertModel.findByIdAndUpdate(
  //     concertId,
  //     { $pull: { reserved: reservation } },
  //     { new: true },
  //   );
  // }
}
