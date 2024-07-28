import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  AllExceptionsFilter,
  PrismaService,
  UserInterceptor,
} from '@app/common';
import { JwtAuthService } from '@app/common/utils';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    JwtAuthService,
    ConfigService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: UserInterceptor,
    // },
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class UsersModule {}
