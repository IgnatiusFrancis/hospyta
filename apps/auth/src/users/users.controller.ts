import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  LoginRequest,
  CreateUserRequest,
} from '@app/common/types/auth';

@Controller()
@AuthServiceControllerMethods()
export class UsersController implements AuthServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(createUserRequest: CreateUserRequest) {
    return this.usersService.createUser(createUserRequest);
  }

  login(loginRequest: LoginRequest) {
    return this.usersService.login(loginRequest);
  }
}
