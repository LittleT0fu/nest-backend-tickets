import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ReservationDto } from './dto/reservation-dto';
import { Types } from 'mongoose';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let service: ConcertsService;

  // Mock data
  const mockConcert = {
    _id: new Types.ObjectId(),
    name: 'Test Concert',
    description: 'Test Description',
    seat: 10,
    reserved: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateConcertDto: CreateConcertDto = {
    name: 'Test Concert',
    description: 'Test Description',
    seat: 10,
  };

  const mockReservationDto: ReservationDto = {
    userName: 'testuser',
  };

  // Mock service
  const mockConcertsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    reserveSeat: jest.fn(),
    cancleReserve: jest.fn(),
    getAllReserve: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    service = module.get<ConcertsService>(ConcertsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a concert', async () => {
      mockConcertsService.create.mockResolvedValue(mockConcert);

      const result = await controller.create(mockCreateConcertDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateConcertDto);
      expect(result).toEqual(mockConcert);
    });
  });

  describe('findAll', () => {
    it('should return all concerts with userName query', async () => {
      const userName = 'testuser';
      const expectedResult = [mockConcert];
      mockConcertsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(userName);

      expect(service.findAll).toHaveBeenCalledWith(userName);
      expect(result).toEqual(expectedResult);
    });

    it('should return all concerts without userName query', async () => {
      const expectedResult = [mockConcert];
      mockConcertsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll('');

      expect(service.findAll).toHaveBeenCalledWith('');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', async () => {
      const concertId = new Types.ObjectId().toString();
      mockConcertsService.findOne.mockResolvedValue(mockConcert);

      const result = await controller.findOne(concertId);

      expect(service.findOne).toHaveBeenCalledWith(concertId);
      expect(result).toEqual(mockConcert);
    });
  });

  describe('remove', () => {
    it('should delete a concert by id', async () => {
      const concertId = new Types.ObjectId().toString();
      const expectedResult = { message: 'delete success' };
      mockConcertsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(concertId);

      expect(service.remove).toHaveBeenCalledWith(concertId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('reserveSeat', () => {
    it('should reserve a seat', async () => {
      const concertId = new Types.ObjectId().toString();
      const expectedResult = { message: 'reserve success', user: 'testuser' };
      mockConcertsService.reserveSeat.mockResolvedValue(expectedResult);

      const result = await controller.reserveSeat(
        concertId,
        mockReservationDto,
      );

      expect(service.reserveSeat).toHaveBeenCalledWith(
        concertId,
        mockReservationDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('cancelReserve', () => {
    it('should cancel a reservation', async () => {
      const concertId = new Types.ObjectId().toString();
      const expectedResult = { message: 'cancel success', user: 'testuser' };
      mockConcertsService.cancleReserve.mockResolvedValue(expectedResult);

      const result = await controller.cancelReserve(
        concertId,
        mockReservationDto,
      );

      expect(service.cancleReserve).toHaveBeenCalledWith(
        concertId,
        mockReservationDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllReserve', () => {
    it('should return all reservations', async () => {
      const expectedResult = {
        totalReservations: 2,
        reservations: [
          {
            concertId: new Types.ObjectId(),
            concertName: 'Concert 1',
            userName: 'user1',
            action: 'reserve',
          },
        ],
      };
      mockConcertsService.getAllReserve.mockResolvedValue(expectedResult);

      const result = await controller.getAllReserve();

      expect(service.getAllReserve).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
