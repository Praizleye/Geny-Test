import { Body, Controller, Post } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IsArray, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';

class LoginDto {
  @IsString()
  sub!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  roles?: Array<'provider' | 'admin'>;
}

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: LoginDto) {
    const roles = Array.isArray(body.roles) && body.roles.length > 0
      ? body.roles.filter((r) => r === 'provider' || r === 'admin')
      : ['provider'];

    const payload = { sub: body.sub, roles };
    const token = jwt.sign(payload, config.jwtSecret, { algorithm: 'HS256', expiresIn: '1h' });
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600,
      payload,
    };
  }
}