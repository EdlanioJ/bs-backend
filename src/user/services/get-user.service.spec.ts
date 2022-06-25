import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/stubs';
import { UserRepository } from '../repositories';
import { GetUserService } from './get-user.service';

jest.mock('../repositories');

describe('GetUserService', () => {
  let service: GetUserService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetUserService, UserRepository],
    }).compile();

    service = module.get<GetUserService>(GetUserService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user model', async () => {
    const id = 'any_id';
    const user = userStub();
    const spy = jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    const out = await service.execute({ id });
    expect(spy).toHaveBeenCalledWith(id);
    expect(out).toEqual(
      expect.objectContaining({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
      }),
    );
  });
});
