import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Determine if request originated from GraphQL or HTTP
    let request: Request | undefined = context
      .switchToHttp()
      .getRequest<Request>();
    if (!request) {
      // GraphQL context – safely attempt to retrieve request

      const gqlCtx = GqlExecutionContext.create(context).getContext<{
        req?: Request;
      }>();

      request = gqlCtx.req;
    }
    if (!request) {
      throw new UnauthorizedException();
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Access token is stored as an HTTP-only cookie named "access_token"
    const cookieToken = (
      request as Request & { cookies?: Record<string, string> }
    ).cookies?.access_token;

    return cookieToken;
  }
}
