import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../../user/repositories';
import { TemplateRepository } from '../repositories';
import { CreateTemplateService } from './create-template.service';

jest.mock('../repositories');
jest.mock('../../user/repositories');

describe('CreateTemplateService', () => {
  let service: CreateTemplateService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CreateTemplateService, UserRepository, TemplateRepository],
    }).compile();
    service = module.get<CreateTemplateService>(CreateTemplateService);
    userRepo = module.get<UserRepository>(UserRepository);
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
});
