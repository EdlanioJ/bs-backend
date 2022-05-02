import { Module } from '@nestjs/common';

import { TemplateRepository } from './repositories';
import { TemplateController } from './controllers';
import {
  CreateTemplateService,
  DeleteTemplateService,
  GetTemplateService,
  ListTemplateService,
} from './services';

import { AuthModule } from '../auth';
import { UserRepository } from '../user/repositories';

@Module({
  imports: [AuthModule],
  providers: [
    CreateTemplateService,
    DeleteTemplateService,
    ListTemplateService,
    GetTemplateService,
    TemplateRepository,
    UserRepository,
  ],
  controllers: [TemplateController],
})
export class TemplateModule {}
