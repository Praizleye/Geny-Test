import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '../config';

export type JwtUser = {
  sub: string; // provider id or user id
  roles: Array<'provider' | 'admin'>;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: JwtUser) {
    // eslint-disable-next-line no-console
    console.log('[JwtStrategy] validated payload', payload);
    return payload; // attached to req.user
  }
}
