import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { POST_SERVICE } from './constant';
import { join } from 'path';
import { POST_PACKAGE_NAME } from '@app/common';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: POST_SERVICE,
        transport: Transport.GRPC,
        options: {
          protoPath: join(__dirname, '../post.proto'),
          package: POST_PACKAGE_NAME,
        },
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
