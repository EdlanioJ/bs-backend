import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { UserRepository } from './user.repository';

const user = userStub();

const db = {
  user: {
    create: jest.fn().mockResolvedValue(user),
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
});
