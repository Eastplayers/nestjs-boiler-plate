import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { verifyJwtToken } from 'src/modules/auth/auth.helper';

declare global {
  namespace Express {
    interface User {
      id?: string;
      full_name?: string;
      email?: string;
      username?: string;
      exp?: number;
    }
    export interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    if (!request.headers.authorization) {
      return false;
    }

    const [scheme, token] = request.headers.authorization.split(' ');
    if (scheme !== 'Bearer') {
      return false;
    }

    const [isValid, user] = verifyJwtToken(token);
    if (!isValid) return false;

    if (user.exp) {
      const today = new Date();
      const expiresAt = new Date(user.exp * 1000);
      if (today > expiresAt) {
        throw new ForbiddenException('Token expired');
      }
    }
    request.user = user;
    return true;
  }
}
