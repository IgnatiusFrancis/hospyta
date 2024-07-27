import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthService {
  constructor(private readonly configService: ConfigService) {}

  generateAuthToken(id: string, email: string) {
    try {
      const secretKey = this.configService.get<string>('JWT_SECRET');
      return jwt.sign({ id, email }, secretKey, {
        expiresIn: '1d',
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error generating authentication token',
      );
    }
  }

  decodeAuthToken(token: string): string | object {
    try {
      const secretKey = this.configService.get<string>('JWT_SECRET');
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token, please login',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
