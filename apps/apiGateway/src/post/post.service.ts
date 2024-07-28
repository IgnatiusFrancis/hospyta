import {
  CreatePostRequest,
  POST_SERVICE_NAME,
  PostServiceClient,
} from '@app/common/types/post';
import { Inject, Injectable } from '@nestjs/common';
import { POST_SERVICE } from './constant';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class PostService {
  private postService: PostServiceClient;

  constructor(@Inject(POST_SERVICE) private client: ClientGrpc) {}
  onModuleInit() {
    this.postService =
      this.client.getService<PostServiceClient>(POST_SERVICE_NAME);
  }

  create(
    userId: string,
    CreatePostRequest: CreatePostRequest,
    file?: Express.Multer.File,
  ) {
    const base64Image = file ? file.buffer.toString('base64') : '';
    return this.postService.createPost({
      ...CreatePostRequest,
      userId,
      image: base64Image,
    });
  }

  // findAll() {
  //   return this.postService.listPosts()
  // }
}
