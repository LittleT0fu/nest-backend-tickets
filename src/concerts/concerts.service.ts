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

  async findAll(userName: string) {
    const result = await this.concertModel.find().exec();
    const newResult = result.map((re) => {
      console.log(userName);
      //convert mongoose object to plain object
      const reObject = re.toObject();
      const { reserved, ...rest } = reObject;
      //add isUserReserved to the result
      return {
        ...rest,
        isUserReserved: userName
          ? reserved.some(
              (res) => res.userName === userName && res.action === 'reserve',
            )
          : false,
        isSeatFull:
          (reserved.filter((reservation) => reservation.action === 'reserve')
            .length || 0) >= rest.seat,
      };
    });
    return newResult;
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
      return result;
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

  async reserveSeat(concertId: string, userName: string) {
    //check concert id is valid
    if (!Types.ObjectId.isValid(concertId)) {
      throw new BadRequestException('concert id is not valid');
    }
    //check concert is exist
    const concert = await this.concertModel.findById(concertId).exec();
    if (!concert) {
      throw new NotFoundException('concert not found');
    }
    //check user already reserved
    const alreadyReserved = await this.concertModel
      .findOne({
        _id: concertId,
        reserved: {
          $elemMatch: {
            userName: userName,
            action: 'reserve',
          },
        },
      })
      .exec();
    if (alreadyReserved) {
      throw new BadRequestException('user already reserved');
    }
    //check seat is full
    const seatReserved =
      concert?.reserved.filter(
        (reservation) => reservation.action === 'reserve',
      ).length || 0;
    if (seatReserved >= concert.seat) {
      throw new BadRequestException('seat is full');
    }

    // push new reserve
    const result = await this.concertModel.findByIdAndUpdate(
      concertId,
      {
        $push: {
          reserved: {
            userName: userName,
            action: 'reserve',
          },
        },
      },
      { new: true },
    );
    return { message: 'reserve success', user: userName };
  }

  async cancleReserve(concertId: string, userName: string) {
    //check concert id is valid
    if (!Types.ObjectId.isValid(concertId)) {
      throw new BadRequestException('concert id is not valid');
    }
    //check concert is exist
    const concert = await this.concertModel.findById(concertId).exec();
    if (!concert) {
      throw new NotFoundException('concert not found');
    }

    //check user already reserved
    const result = await this.concertModel.findOneAndUpdate(
      {
        _id: concertId,
        reserved: {
          $elemMatch: { userName: userName, action: 'reserve' },
        },
      },
      {
        $set: { 'reserved.$.action': 'cancel' },
      },
      { new: true },
    );
    if (!result) {
      throw new NotFoundException('user not found');
    }
    return { message: 'cancel success', user: userName };
  }

  async getReservedSeatCount(concertId: string): Promise<number> {
    const result = await this.concertModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(concertId) } },
        { $unwind: '$reserved' },
        { $match: { 'reserved.action': 'reserve' } },
        { $count: 'total' },
      ])
      .exec();

    return result[0]?.total || 0;
  }
}
