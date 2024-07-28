import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@app/common';
import {
  CreatePostRequest,
  CreatePostResponse,
  EditPostRequest,
  EditPostResponse,
  DeletePostRequest,
  DeletePostResponse,
  ListPostsRequest,
  ListPostsResponse,
  GetPostByIdRequest,
  GetPostByIdResponse,
  Edit,
  // UpvotePostRequest,
  // UpvotePostResponse,
  // DownvotePostRequest,
  // DownvotePostResponse,
  // AddCommentRequest,
  // AddCommentResponse,
  // GetCommentsByPostIdRequest,
  // GetCommentsByPostIdResponse,
} from '@app/common/types/post';
import {
  AddCommentRequest,
  AddCommentResponse,
  GetCommentsByPostIdRequest,
  GetCommentsByPostIdResponse,
} from '@app/common/types/comment';
import { RpcException } from '@nestjs/microservices';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Image } from '@prisma/client';
import { Readable } from 'stream';

// Helper function to convert buffer to stream
function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

@Injectable()
export class PostService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {}

  async createPost(
    createPostRequest: CreatePostRequest,
  ): Promise<CreatePostResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: createPostRequest.userId },
    });

    if (!user) {
      throw new RpcException('User not found');
    }

    let imageId: string | null = null;
    let imageUrl: string | null = null;

    if (createPostRequest.image) {
      const imageBuffer = Buffer.from(createPostRequest.image, 'base64');
      const result = await this.uploadToCloudinary(imageBuffer);

      if (result && result.public_id) {
        imageId = result.public_id;
        imageUrl = result.secure_url;
      }
    }

    let image: Image | null = null;

    if (imageId && imageUrl) {
      image = await this.prismaService.image.create({
        data: {
          userId: createPostRequest.userId,
          url: imageUrl,
        },
      });
    }

    const newPost = await this.prismaService.post.create({
      data: {
        content: createPostRequest.content,
        imageId: image ? image.id : null,
        categories: createPostRequest.categories,
        userId: user.id,
      },
      include: { user: true, image: true },
    });

    return {
      post: {
        ...newPost,
        user: {
          id: newPost.user.id,
          email: newPost.user.email,
          name: newPost.user.name,
          picture: newPost.user.imageId,
        },
        image: image
          ? {
              id: image.id,
              userId: image.userId,
              url: image.url,
              createdAt: image.createdAt.toISOString(),
            }
          : null,
        createdAt: newPost.createdAt.toISOString(),
        updatedAt: newPost.updatedAt.toISOString(),
      },
    };
  }

  private uploadToCloudinary(
    buffer: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'testFile' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      bufferToStream(buffer).pipe(upload);
    });
  }

  public bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  async editPost(editPostRequest: EditPostRequest): Promise<EditPostResponse> {
    const post = await this.prismaService.post.findUnique({
      where: { id: editPostRequest.id },
      include: { user: true },
    });

    if (!post) {
      throw new RpcException('Post not found');
    }

    if (post.userId !== editPostRequest.userId) {
      throw new RpcException('You are not authorized to update this post');
    }

    const updatedPost = await this.prismaService.post.update({
      where: { id: editPostRequest.id },
      data: {
        content: editPostRequest.content,

        categories: editPostRequest.categories,
      },
      include: { user: true, image: true },
    });

    const editResponse: Edit = {
      id: updatedPost.id,
      content: updatedPost.content,
      categories: updatedPost.categories,
      user: {
        id: updatedPost.user.id,
        email: updatedPost.user.email,
        name: updatedPost.user.name,
        picture: updatedPost.user.imageId,
      },
    };

    return { edit: editResponse };
  }

  async deletePost(
    deletePostRequest: DeletePostRequest,
  ): Promise<DeletePostResponse> {
    const post = await this.prismaService.post.findUnique({
      where: { id: deletePostRequest.id },
      include: { user: true },
    });

    if (!post) {
      throw new RpcException('Post not found');
    }

    if (post.userId !== deletePostRequest.userId) {
      throw new RpcException('You are not authorized to delete this post');
    }

    // Delete the post
    await this.prismaService.post.delete({
      where: { id: deletePostRequest.id },
    });

    return { success: true, message: 'Post deleted successfully' };
  }

  async getPostById(
    getPostByIdRequest: GetPostByIdRequest,
  ): Promise<GetPostByIdResponse> {
    const post = await this.prismaService.post.findUnique({
      where: { id: getPostByIdRequest.id },
      include: { user: true, image: true },
    });

    if (!post) {
      throw new RpcException('Post not found');
    }

    if (post.userId !== getPostByIdRequest.userId) {
      throw new RpcException('You are not authorized to view this post');
    }

    const postResponse = {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      image: {
        ...post.image,
        createdAt: post.image.createdAt.toISOString(),
      },
      user: {
        id: post.user.id,
        email: post.user.email,
        name: post.user.name,
        picture: post.user.imageId,
      },
    };

    return { post: postResponse };
  }

  async listPosts(): Promise<ListPostsResponse> {
    const posts = await this.prismaService.post.findMany({
      include: { user: true, image: true },
    });

    const postResponses = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      image: post.image
        ? {
            ...post.image,
            createdAt: post.image.createdAt.toISOString(),
          }
        : null,
      user: {
        id: post.user.id,
        email: post.user.email,
        name: post.user.name,
        picture: post.user.imageId,
      },
    }));

    return { posts: postResponses };
  }
}
