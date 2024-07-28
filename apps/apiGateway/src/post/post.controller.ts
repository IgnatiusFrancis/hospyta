import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostRequest } from '@app/common/types/post';
import { CurrentUser, JwtGuard } from '@app/common';
import { User } from '@prisma/client';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/,
        })
        .addMaxSizeValidator({
          maxSize: 5000000,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() createPostRequest: CreatePostRequest,
    @CurrentUser() user: User,
  ) {
    return this.postService.create(user.id, createPostRequest, file);
  }

  // @Get()
  // findAll() {
  //   return this.postService.findAll();
  // }
}
