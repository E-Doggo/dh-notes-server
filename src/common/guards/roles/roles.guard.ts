import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JWTUserDto } from 'src/DTO/jwtUser.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const request: { user: JWTUserDto } = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new ForbiddenException('No user found in request');
    }
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException(
        `Role "${request.user.role}" is not allowed`,
      );
    }

    return true;
  }
}
