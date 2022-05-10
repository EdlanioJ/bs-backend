import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub } from '../../../test/mocks/stubs';
import { UserRepository } from '../../user/repositories';
import { TemplateRepository } from '../repositories';
import { CreateTemplateService } from './create-template.service';

jest.mock('../repositories');
jest.mock('../../user/repositories');

describe('CreateTemplateService', () => {
  let service: CreateTemplateService;
  let userRepo: UserRepository;
  let templateRepo: TemplateRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CreateTemplateService, UserRepository, TemplateRepository],
    }).compile();
    service = module.get<CreateTemplateService>(CreateTemplateService);
    userRepo = module.get<UserRepository>(UserRepository);
    templateRepo = module.get<TemplateRepository>(TemplateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    const spy = jest.spyOn(userRepo, 'findOne').mockReturnValue(null);
    const out = service.execute({
      body: 'body',
      subject: 'subject',
      type: 'type',
      userId: 'userId',
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('userId');
    await expect(out).rejects.toThrow(
      new BadRequestException('User not found'),
    );
  });

  it('should throw UnauthorizedException if invalid user', async () => {
    const user = userStub();
    user.role = 'USER';
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    const out = service.execute({
      body: 'body',
      subject: 'subject',
      type: 'type',
      userId: 'userId',
    });
    await expect(out).rejects.toThrow(
      new UnauthorizedException('Invalid user'),
    );
  });

  it('should create template', async () => {
    const user = userStub();
    user.role = 'ADMIN';
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    const spy = jest.spyOn(templateRepo, 'create');
    await service.execute({
      body: 'body',
      subject: 'subject',
      type: 'type',
      userId: 'userId',
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      body: 'body',
      subject: 'subject',
      type: 'type',
      user: { connect: { id: user.id } },
    });
  });
});
