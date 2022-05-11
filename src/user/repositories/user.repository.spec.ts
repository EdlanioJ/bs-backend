import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { UserRepository } from './user.repository';

const user = userStub();

const db = {
  user: {
    create: jest.fn().mockResolvedValue(user),
    findFirst: jest.fn().mockResolvedValue(user),
    findMany: jest.fn().mockResolvedValue([user]),
    update: jest.fn().mockResolvedValue(user),
  },
};
describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository, { provide: PrismaService, useValue: db }],
    }).compile();
    repository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a user', async () => {
    const spy = jest.spyOn(prisma.user, 'create');
    const result = await repository.create({
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
    });
    expect(result).toEqual(user);
    expect(spy).toHaveBeenCalledWith({
      data: {
        email: 'any_email',
        password: 'any_password',
        name: 'any_name',
      },
    });
  });

  it('should find one user', async () => {
    const spy = jest.spyOn(prisma.user, 'findFirst');
    const result = await repository.findOne('any_id');
    expect(result).toEqual(user);
    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 'any_id',
      },
    });
  });

  it('should find one user by email', async () => {
    const spy = jest.spyOn(prisma.user, 'findFirst');
    const result = await repository.findOneByEmail('any_email');
    expect(result).toEqual(user);
    expect(spy).toHaveBeenCalledWith({
      where: {
        email: 'any_email',
      },
    });
  });

  it('should find one user by refresh token', async () => {
    const spy = jest.spyOn(prisma.user, 'findFirst');
    const result = await repository.findOneByResetToken('any_token');
    expect(result).toEqual(user);
    expect(spy).toHaveBeenCalledWith({
      where: {
        resetPasswordToken: 'any_token',
      },
    });
  });

  it('should find one user by third party id', async () => {
    const spy = jest.spyOn(prisma.user, 'findFirst');
    const result = await repository.findOneByThirdPartyId('any_id');
    expect(result).toEqual(user);
    expect(spy).toHaveBeenCalledWith({
      where: {
        thirdPartyId: 'any_id',
      },
    });
  });

  it('should find all users', async () => {
    const spy = jest.spyOn(prisma.user, 'findMany');
    const result = await repository.findAll();
    expect(result).toEqual([user]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update a user', async () => {
    const spy = jest.spyOn(prisma.user, 'update');
    const result = await repository.update('any_id', {
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
    });
    expect(result).toEqual(user);
    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 'any_id',
      },
      data: {
        email: 'any_email',
        password: 'any_password',
        name: 'any_name',
      },
    });
  });
});
