import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TemplateRepository } from './template.repository';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [TemplateRepository, TemplateService, UserRepository],
  exports: [TemplateRepository],
  controllers: [TemplateController],
})
export class TemplateModule {}
