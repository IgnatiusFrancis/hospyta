import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import {
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
} from '@app/common/types/auth';
import * as bcrypt from 'bcryptjs';
import { JwtAuthService } from '@app/common/utils';
import { Image, User } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnModuleInit {
  async onModuleInit() {}

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async createUser(
    createUserRequest: CreateUserRequest,
    file?: Express.Multer.File,
  ): Promise<CreateUserResponse> {
    try {
      // Check if the user already exists
      await this.checkUserExists(createUserRequest.email);

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(createUserRequest.password, 10);

      let result;
      if (file) {
        // Upload the file to Cloudinary and get the result
        result = await this.uploadToCloudinary(file);
      }

      let image: Image | null = null;
      if (result) {
        // Create an image entry in the database with the URL from Cloudinary
        image = await this.prismaService.image.create({
          data: {
            userId: '',
            url: result.url,
          },
        });
      }

      const imageId = image?.id;

      // Create the new user
      const newUser = await this.signupUser(
        createUserRequest.email,
        createUserRequest.name,
        hashedPassword,
        imageId,
      );

      // Format and return the response
      return this.formatSignupResponse(newUser);
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      const user = await this.verifyUser(
        loginRequest.email,
        loginRequest.password,
      );

      const token = this.jwtAuthService.generateAuthToken(user.id, user.email);
      return this.formatLoginResponse(user, token);
    } catch (error) {
      throw error;
    }
  }

  private async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.getUserByEmail(email);

    this.checkUserExistence(user);

    await this.checkPasswordMatch(password, user.password);

    return user;
  }

  private async checkUserExists(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      //throw new RpcException('Invalid credentials.');
      throw new RpcException('User with this email already exists');
    }
  }

  private async signupUser(
    email: string,
    name: string,
    password: string,
    imageId: string,
  ): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email,
        name,
        password,
        imageId: imageId ? imageId : null,
      },
    });
  }

  private checkUserExistence(user: User | null) {
    if (!user) {
      throw new RpcException('User not found');
    }
  }

  private async checkPasswordMatch(password: string, hashedPassword: string) {
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      throw new RpcException('Invalid email or password');
    }
  }

  private formatLoginResponse(user: User, token: string): LoginResponse {
    const { password, ...data } = user;
    return {
      email: data.email,
      name: data.email,
      accessToken: token,
    };
  }

  private formatSignupResponse(newUser: User): CreateUserResponse {
    const { password, ...data } = newUser;
    return {
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.imageId || null,
      },
    };
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { picture: true },
    });
  }

  public async getUserById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { picture: true },
    });
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      if (!file.mimetype.startsWith('image')) {
        reject(new Error('Sorry, this file is not an image, please try again'));
        return;
      }

      const upload = cloudinary.uploader.upload_stream(
        { folder: 'hospyta' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
