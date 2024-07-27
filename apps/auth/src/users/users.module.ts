import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@app/common';
import { JwtAuthService } from '@app/common/utils';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtAuthService, ConfigService],
})
export class UsersModule {}
