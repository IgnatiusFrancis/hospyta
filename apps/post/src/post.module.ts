import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtGuard, PrismaService } from '@app/common';
import { JwtAuthService } from '@app/common/utils';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [
    PostService,
    PrismaService,
    ConfigService,
    JwtGuard,
    JwtAuthService,
  ],
})
export class PostModule {}
