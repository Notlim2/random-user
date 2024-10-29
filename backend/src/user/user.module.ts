import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from './user.repository';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
