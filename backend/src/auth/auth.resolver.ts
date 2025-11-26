import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthToken } from './auth-token.model';
import { TokenPayload } from './token-payload.model';
import { Response, Request } from 'express';
import { Public } from '../common/decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthToken)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Context() context: { res: Response },
  ): Promise<AuthToken> {
    const { access_token, refresh_token } = await this.authService.signIn(
      username,
      password,
    );

    // set refresh token cookie
    context.res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // 개발 환경에서는 false
      path: '/graphql',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    // set access token cookie
    context.res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // 개발 환경에서는 false
      path: '/graphql',
      maxAge: 1000 * 60 * 30, // 30 minutes
    });

    return { success: true };
  }

  @Public()
  @Mutation(() => AuthToken)
  async refreshToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<AuthToken> {
    const refreshTokenCookie =
      (context.req.cookies as Record<string, string> | undefined)
        ?.refresh_token ?? '';
    const { access_token, refresh_token } =
      await this.authService.refresh(refreshTokenCookie);

    // clear previous refresh token cookie
    context.res.clearCookie('refresh_token', { path: '/graphql' });

    context.res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // 개발 환경에서는 false
      path: '/graphql',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    // set access token cookie
    context.res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // 개발 환경에서는 false
      path: '/graphql',
      maxAge: 1000 * 60 * 30, // 30 minutes
    });

    return { success: true };
  }

  @Query(() => TokenPayload)
  tokenPayload(@Context() context: { req: Request }): Promise<TokenPayload> {
    const payload = context.req?.['user'];
    return payload;
  }
}
