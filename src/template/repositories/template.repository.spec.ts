import { Test } from '@nestjs/testing';
import { templateStub } from '../../../test/mocks/stubs';
import { PrismaService } from '../../prisma';
import { TemplateRepository } from './template.repository';

const template = templateStub();

const db = {
  template: {
    create: jest.fn().mockResolvedValue(template),
    update: jest.fn().mockResolvedValue(template),
    findFirst: jest.fn().mockResolvedValue(template),
  },
};

describe('TemplateRepository', () => {
  let repository: TemplateRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TemplateRepository, { provide: PrismaService, useValue: db }],
    }).compile();
    repository = module.get<TemplateRepository>(TemplateRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a template', async () => {
    const spy = jest.spyOn(prisma.template, 'create');
    const result = await repository.create({
      type: 'type',
      body: 'body',
      subject: 'subject',
      user: { connect: { id: 'userId' } },
    });
    expect(spy).toHaveBeenCalledWith({
      data: {
        type: 'type',
        body: 'body',
        subject: 'subject',
        user: { connect: { id: 'userId' } },
      },
    });
    expect(result).toEqual(template);
  });

  it('should update a template', async () => {
    const spy = jest.spyOn(prisma.template, 'update');
    const result = await repository.update('templateId', {
      type: 'type',
    });
    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 'templateId',
      },
      data: {
        type: 'type',
      },
    });
    expect(result).toEqual(template);
  });

  it('should find a template', async () => {
    const spy = jest.spyOn(prisma.template, 'findFirst');
    const result = await repository.findOne('templateId');
    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 'templateId',
      },
    });
    expect(result).toEqual(template);
  });
});
