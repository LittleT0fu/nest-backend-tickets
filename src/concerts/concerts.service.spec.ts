import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { Concert, ConcertDocument } from './schemas/concerts.schema';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ReservationDto } from './dto/reservation-dto';
import { Model, Types } from 'mongoose';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let concertModel: Model<ConcertDocument>;

  //mock data
  const mockConcert = {
    _id: new Types.ObjectId(),
    name: 'Test Concert',
    description: 'Test Description',
    seat: 10,
    reserved: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: jest.fn().mockReturnThis(),
  };

  const mockConcertWithReservations = {
    ...mockConcert,
    reserved: [
      { userName: 'user1', action: 'reserve' },
      { userName: 'user2', action: 'reserve' },
    ],
  };

  //dto
  const mockCreateConcertDto: CreateConcertDto = {
    name: 'Test Concert',
    description: 'Test Description',
    seat: 10,
  };

  const mockReservationDto: ReservationDto = {
    userName: 'testuser',
  };

  // Mock model methods
  // Replace lines 46-70 with:

  const mockConcertModel: any = jest
    .fn()
    .mockImplementation((createConcertDto) => ({
      save: jest.fn().mockResolvedValue(mockConcert),
    }));

  // Add static methods
  Object.assign(mockConcertModel, {
    find: jest.fn().mockReturnValue({
      exec: jest
        .fn()
        .mockResolvedValue([mockConcert, mockConcertWithReservations]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockConcert),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockConcert),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockConcert),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
    findOneAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockConcert),
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getModelToken(Concert.name),
          useValue: mockConcertModel,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    concertModel = module.get<Model<ConcertDocument>>(
      getModelToken(Concert.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //create
  describe('create', () => {
    it('should create a new concert', async () => {
      const result = await service.create(mockCreateConcertDto);

      expect(mockConcertModel).toHaveBeenCalledWith(mockCreateConcertDto);
      expect(result).toEqual(mockConcert);
    });
  });

  //find all concerts
  describe('findAll', () => {
    it('should return all concerts with user reservation status', async () => {
      const userName = 'testuser';
      const result = await service.findAll(userName);

      expect(mockConcertModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('isUserReserved');
      expect(result[0]).toHaveProperty('isSeatFull');
    });

    it('should return concerts without user name', async () => {
      const result = await service.findAll('');

      expect(mockConcertModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].isUserReserved).toBe(false);
    });

    //seat availability
    it('should calculate seat availability correctly', async () => {
      const result = await service.findAll('');

      expect(result[0].isSeatFull).toBe(false); // No reservations
      expect(result[1].isSeatFull).toBe(false); // 2 reservations < 100 seats
    });
  });

  //find one concert
  describe('findOne', () => {
    it('should return a concert by valid id', async () => {
      const validId = new Types.ObjectId().toString();
      const result = await service.findOne(validId);

      expect(mockConcertModel.findById).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockConcert);
    });

    it('should throw BadRequestException for invalid id', async () => {
      const invalidId = 'invalid-id';

      await expect(service.findOne(invalidId)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockConcertModel.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when concert not found', async () => {
      const validId = new Types.ObjectId().toString();
      mockConcertModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(validId)).rejects.toThrow(NotFoundException);
    });
  });

  //remove a concert
  describe('remove', () => {
    it('should delete a concert by valid id', async () => {
      const validId = new Types.ObjectId().toString();
      const result = await service.remove(validId);

      expect(mockConcertModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
      expect(result).toEqual({ message: 'delete success' });
    });

    it('should throw BadRequestException for invalid id', async () => {
      const invalidId = 'invalid-id';

      await expect(service.remove(invalidId)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockConcertModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when concert not found', async () => {
      const validId = new Types.ObjectId().toString();
      mockConcertModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(validId)).rejects.toThrow(NotFoundException);
    });
  });

  //reserve a seat
  describe('reserveSeat', () => {
    it('should reserve a seat successfully', async () => {
      const concertId = new Types.ObjectId().toString();
      mockConcertModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockConcert),
      });
      mockConcertModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // No existing reservation
      });

      const result = await service.reserveSeat(concertId, mockReservationDto);

      expect(result).toEqual({
        message: 'reserve success',
        user: mockReservationDto.userName,
      });
      expect(mockConcertModel.findByIdAndUpdate).toHaveBeenCalledWith(
        concertId,
        {
          $push: {
            reserved: {
              userName: mockReservationDto.userName,
              action: 'reserve',
            },
          },
        },
        { new: true },
      );
    });

    it('should throw BadRequestException for invalid concert id', async () => {
      const invalidId = 'invalid-id';

      await expect(
        service.reserveSeat(invalidId, mockReservationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  //cancle a seat
  describe('cancleReserve', () => {
    it('should cancel a reservation successfully', async () => {
      const concertId = new Types.ObjectId().toString();
      mockConcertModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockConcert),
      });
    });

    it('should throw BadRequestException for invalid concert id', async () => {
      const invalidId = 'invalid-id';

      await expect(
        service.cancleReserve(invalidId, mockReservationDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when concert not found', async () => {
      const validId = new Types.ObjectId().toString();
      mockConcertModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.cancleReserve(validId, mockReservationDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  it('should throw BadRequestException when user already reserved', async () => {
    const concertId = new Types.ObjectId().toString();
    mockConcertModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockConcert),
    });
    mockConcertModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockConcert), // User already reserved
    });

    await expect(
      service.reserveSeat(concertId, mockReservationDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when seat is full', async () => {
    const concertId = new Types.ObjectId().toString();
    const fullConcert = {
      ...mockConcert,
      seat: 2,
      reserved: [
        { userName: 'user1', action: 'reserve' },
        { userName: 'user2', action: 'reserve' },
      ],
    };
    mockConcertModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(fullConcert),
    });
    mockConcertModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(
      service.reserveSeat(concertId, mockReservationDto),
    ).rejects.toThrow(BadRequestException);
  });

  describe('getAllReserve', () => {
    it('should return all reservations', async () => {
      const mockReservations = [
        {
          _id: new Types.ObjectId(),
          name: 'Concert 1',
          seat: 100,
          reserved: [
            { userName: 'user1', action: 'reserve' },
            { userName: 'user2', action: 'cancel' },
          ],
        },
        {
          _id: new Types.ObjectId(),
          name: 'Concert 2',
          seat: 50,
          reserved: [{ userName: 'user3', action: 'reserve' }],
        },
      ];

      mockConcertModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReservations),
      });

      const result = await service.getAllReserve();

      expect(mockConcertModel.find).toHaveBeenCalledWith(
        {},
        { name: 1, reserved: 1, seat: 1 },
      );
      expect(result).toHaveProperty('totalReservations');
      expect(result).toHaveProperty('reservations');
      expect(result.totalReservations).toBe(3);
      expect(result.reservations).toHaveLength(3);
    });
  });
});
