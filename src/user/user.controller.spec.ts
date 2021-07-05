import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createOne: jest.fn().mockImplementation((userDto: CreateUserDto) => {
              return Promise.resolve({ id: 'a uuid..', ...userDto });
            }),
            findAll: jest.fn().mockResolvedValue([
              { firstName: "seema", lastName: "ss", userName: "seema", age: 20, isActive: true },
              { firstName: "reema", lastName: "rr", userName: "reema", age: 22, isActive: false },
            ]),
            findOneUser: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({ firstName: "seema", lastName: "ss", userName: "seema", age: 20, isActive: true, id })
            }),
            update: jest.fn().mockImplementation((updateDto: UpdateUserDto) => {
              return Promise.resolve({ firstName: "seema", lastName: "ss", userName: "seema", age: 20, isActive: true, id: "a uuid" })
            }),
            remove: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({ deleted: true })
            })
          }
        }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const userDto = {
        firstName: "teena",
        lastName: "tt",
        userName: "teena",
        age: 20,
        isActive: true
      }
      expect(await controller.create(userDto)).toEqual({
        statusCode: 200,
        message: 'User created successfully',
        user: {
          id: 'a uuid..',
          firstName: "teena",
          lastName: "tt",
          userName: "teena",
          age: 20,
          isActive: true
        }
      })
    })
  })

  describe("findAll", () => {
    it("should find all users", async () => {
      expect(await controller.findAll()).toEqual({
        statusCode: 200,
        message: "Users fetched successfully",
        users: [
          { firstName: "seema", lastName: "ss", userName: "seema", age: 20, isActive: true },
          { firstName: "reema", lastName: "rr", userName: "reema", age: 22, isActive: false },
        ]
      })
    })
  })

  describe("findBYId", () => {
    it("should find a user by id ,if the user exist with the given id", async () => {
      await expect( controller.findById("an id")).resolves.toEqual({
        statusCode: 200,
        message: 'User fetched successfully',
        data: {
          firstName: "seema", lastName: "ss", userName: "seema", age: 20, isActive: true, id: "an id"
        }
      })
    })
    it("should throw an error if the user doesn't exist with the given id",async() => {
      jest.spyOn(service,"findOneUser").mockRejectedValue(new NotFoundException("USER NOT FOUND"));
      const nonExistentId = 'abcd';
      await expect(controller.findById(nonExistentId)).rejects.toThrow(new NotFoundException("USER NOT FOUND"));
      expect(service.findOneUser).toHaveBeenCalledWith(nonExistentId);

  })})
  
  describe("update", () => {
    it("should update a user", async () => {
      const updateDto = {
        age: 20,
        isActive: true
      }
      expect(await controller.update("a uuid",updateDto)).toEqual({
        statusCode: 200,
        message: 'User updated successfully',
        data: {
          id: 'a uuid',
          firstName: "seema",
          lastName: "ss",
          userName: "seema",
          age: 20,
          isActive: true
        }
      })
    })
  })
  
  describe("remove", () => {
    it("should delete a user by id", async () => {
      await expect( controller.remove("an id")).resolves.toEqual({
        statusCode: 200,
        message: 'User deleted successfully'
      })
    })
  })


});
