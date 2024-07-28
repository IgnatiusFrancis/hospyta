import { Controller } from '@nestjs/common';
import { PostService } from './post.service';
import {
  PostServiceController,
  PostServiceControllerMethods,
  CreatePostRequest,
  CreatePostResponse,
  GetPostByIdRequest,
  GetPostByIdResponse,
  DeletePostRequest,
  DeletePostResponse,
  EditPostRequest,
  EditPostResponse,
  ListPostsRequest,
  ListPostsResponse,
} from '@app/common/types/post';

@Controller()
@PostServiceControllerMethods()
export class PostController implements PostServiceController {
  constructor(private readonly postService: PostService) {}

  async createPost(
    createPostRequest: CreatePostRequest,
  ): Promise<CreatePostResponse> {
    return this.postService.createPost(createPostRequest);
  }

  async editPost(editPostRequest: EditPostRequest): Promise<EditPostResponse> {
    return this.postService.editPost(editPostRequest);
  }

  async deletePost(
    deletePostRequest: DeletePostRequest,
  ): Promise<DeletePostResponse> {
    return this.postService.deletePost(deletePostRequest);
  }

  async listPosts(): Promise<ListPostsResponse> {
    return this.postService.listPosts();
  }

  async getPostById(
    getPostByIdRequest: GetPostByIdRequest,
  ): Promise<GetPostByIdResponse> {
    return this.postService.getPostById(getPostByIdRequest);
  }
}
