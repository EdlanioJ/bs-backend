import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TemplateRepository } from './template.repository';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule, UserModule],
  providers: [TemplateRepository, TemplateService],
  exports: [TemplateRepository],
  controllers: [TemplateController],
})
export class TemplateModule {}
