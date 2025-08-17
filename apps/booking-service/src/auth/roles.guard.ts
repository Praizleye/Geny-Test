import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY, Role } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      // eslint-disable-next-line no-console
      console.log('[RolesGuard] No roles required for this route');
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user as { sub?: string; roles?: Role[] } | undefined;

    if (!user) {
      // eslint-disable-next-line no-console
      console.warn('[RolesGuard] Missing req.user. JWT might be invalid or not provided');
      return false;
    }

    if (!user.roles || user.roles.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('[RolesGuard] User has no roles', { sub: user.sub });
      return false;
    }

    const allow = required.some((r) => user.roles!.includes(r));
    // eslint-disable-next-line no-console
    console.log('[RolesGuard] Decision', {
      sub: user.sub,
      userRoles: user.roles,
      requiredRoles: required,
      allow,
    });
    return allow;
  }
}

export const JwtAuthGuard = AuthGuard('jwt');
