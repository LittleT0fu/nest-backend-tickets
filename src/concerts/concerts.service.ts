import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    try {
      //check id is valid object id
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('id not found');
      }
      const result = await this.concertModel.findById(id).exec();
      if (!result) {
        throw new NotFoundException('id not found');
      }
      return { message: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      //check valid id
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('id not found');
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
    const alreadyReserved = await this.concertModel
      .findOne({
        _id: concertId,
        reserved: {
          $elemMatch: {
            userName: reservation.userName,
            action: 'reserve',
          },
        },
      })
      .exec();
    if (alreadyReserved) {
      throw new BadRequestException('user already reserved');
    }

    const result = await this.concertModel.findByIdAndUpdate(
      concertId,
      { $push: { reserved: reservation } },
      { new: true },
    );
    return result;
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
