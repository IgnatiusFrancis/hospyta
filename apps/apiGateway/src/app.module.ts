import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter, UserInterceptor } from '@app/common';
import { PostModule } from './post/post.module';

@Module({
  imports: [UsersModule, PostModule],
  controllers: [],
  providers: [
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
export class AppModule {}
