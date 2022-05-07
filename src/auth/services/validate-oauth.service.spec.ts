import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { ValidateOAuthService } from './validate-oauth.service';

jest.mock('../../mail/services');
jest.mock('../../user/repositories');

describe('ValidateOAuthService', () => {
  let service: ValidateOAuthService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateOAuthService,
        UserRepository,
        SendMailProducerService,
      ],
    }).compile();

    service = module.get<ValidateOAuthService>(ValidateOAuthService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update user', async () => {
    const user = userStub();
    const findSpy = jest
      .spyOn(userRepo, 'findOneByThirdPartyId')
      .mockResolvedValueOnce(user);
    const updateSpy = jest
      .spyOn(userRepo, 'update')
      .mockResolvedValueOnce(user);

    const result = await service.execute({
      avatar: user.avatar,
      email: user.email,
      name: user.name,
      provider: user.provider,
      thirdPartyId: user.thirdPartyId,
    });

    expect(result).toEqual({
      id: user.id,
      username: user.name,
      role: user.role,
    });
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledWith(user.thirdPartyId);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(user.id, {
      avatar: user.avatar,
      email: user.email,
      name: user.name,
      provider: user.provider,
      thirdPartyId: user.thirdPartyId,
    });
  });
});
