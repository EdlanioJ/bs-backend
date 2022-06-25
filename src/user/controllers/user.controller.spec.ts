import { Test } from '@nestjs/testing';
import { GetUserService } from '../services';
import { UserController } from './user.controller';

jest.mock('../services');

describe('UserController', () => {
  let controller: UserController;
  let getUserService: GetUserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [GetUserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    getUserService = module.get<GetUserService>(GetUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('profile', () => {
    it('should return a user model', async () => {
      const id = 'any_id';
      const user = {
        id,
        name: 'any_name',
        avatar: 'any_avatar',
        createdAt: new Date(),
      };
      const spy = jest.spyOn(getUserService, 'execute').mockResolvedValue(user);
      const out = await controller.profile(id);
      expect(spy).toHaveBeenCalledWith({ id });
      expect(out).toEqual(
        expect.objectContaining({
          id,
          name: user.name,
          avatar: user.avatar,
          createdAt: user.createdAt,
        }),
      );
    });
  });
});
