import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm/dist';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repo:Repository<User>;

  const userArray =[
    { id:'a uuid',firstName: "seema", lastName: "ss", userName: "seema", age: 20, isActive: true },
    { id:'a uuid',firstName: "reema", lastName: "rr", userName: "reema", age: 22, isActive: false },
  ]

  const user = { id:'a uuid',firstName: "seema", lastName: "ss", userName: "seema", age: 20, isActive: true }
  
  const mockRepo = {
    create:jest.fn().mockResolvedValue(user),
    find:jest.fn().mockResolvedValue(userArray),
    findOne:jest.fn().mockResolvedValue(user),
    save: jest.fn().mockResolvedValue(user),
    update:jest.fn().mockResolvedValue(true),
    delete:jest.fn().mockResolvedValue(true),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
      {
        provide:getRepositoryToken(User),
        useValue:mockRepo
      }],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("findAll",() => {
    it("should get all users",async() => [
      await expect(service.findAll()).resolves.toEqual(userArray)
    ])
  });

  describe("findOneUser",() => {
    it("should get a single user by id",() => {
      expect(service.findOneUser("a uuid")).resolves.toEqual(user)
    })

    it("should throw an error as user doesn't exist",async() => {
      jest.spyOn(mockRepo,"findOne").mockResolvedValueOnce(null);
      const nonExistentId = 'abcd';
      await expect(service.findOneUser(nonExistentId)).rejects.toThrow(new NotFoundException("USER NOT FOUND"));
    })
  })

  describe("createOne",() => {
    it("should create a new user",() => {
        expect(service.createOne({
          firstName: "seema", lastName: "ss", userName: "seema", age: 20, isActive: true
        })).resolves.toEqual(user)
    })
  })

  describe("update",() => {
    it("should update a user",() => {
      expect(service.update("a uuid",{
        age: 20,
        isActive: true
      })).resolves.toEqual(user)
    })
  })

  describe("remove",() => {
    it("should remove a user",() => {
        expect(service.remove('a uuid')).resolves.toEqual({deleted:true})
    })

    
  })




});
