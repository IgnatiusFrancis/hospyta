import { NestFactory } from '@nestjs/core';
import { PostModule } from './post.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { POST_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../post.proto'),
        package: POST_PACKAGE_NAME,
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen();
}
bootstrap();
