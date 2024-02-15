
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';


const mockUser = { _id: 'someId', name: 'Test User', email: 'test@example.com' };


describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: Model<UserDocument>;

  beforeEach(async () => {
    // Mock model methods
    const mockUserModelProvider = {
      provide: getModelToken(User.name),
      useValue: {
        // Simulate constructor behavior
        new: jest.fn().mockImplementation((dto) => dto),
        // Or directly use jest.fn() if you're not using 'new' keyword in your service
        create: jest.fn().mockResolvedValue(mockUser), // Assuming mockUser is your mocked user document
        // Mock other methods used by your service
        find: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockUser]), // For findAll method
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, mockUserModelProvider],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Example test for create method
  it('should create a new user', async () => {
    const createUserDto = { name: 'Test User', email: 'test@example.com' }; // Adjust according to your CreateUserDto
    expect(await service.create(createUserDto)).toEqual(mockUser);
    expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
  });
});
