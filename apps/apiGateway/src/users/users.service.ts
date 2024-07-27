import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserResponse,
  LoginResponse,
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  CreateUserRequest,
  LoginRequest,
} from '@app/common/types/auth';
import { AUTH_SERVICE } from './constant';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnModuleInit {
  private userService: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}
  onModuleInit() {
    this.userService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  create(createUserRequest: CreateUserRequest, file?: Express.Multer.File) {
    return this.userService.createUser(createUserRequest);
  }

  login(loginRequest: LoginRequest) {
    return this.userService.login(loginRequest);
  }
}
