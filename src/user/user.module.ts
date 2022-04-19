import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
