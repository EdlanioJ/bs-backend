import { Module } from '@nestjs/common';

import { TemplateRepository } from './repositories/template.repository';
import { TemplateController } from './controllers/template.controller';
import { ListTemplateService } from './services/list-template.service';
import { CreateTemplateService } from './services/create-template.service';
import { GetTemplateService } from './services/get-template.service';
import { DeleteTemplateService } from './services/delete-template.service';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    CreateTemplateService,
    DeleteTemplateService,
    GetTemplateService,
    ListTemplateService,
    TemplateRepository,
    UserRepository,
  ],
  controllers: [TemplateController],
})
export class TemplateModule {}
