import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Public } from '../common/decorators/public.decorator';
import { SignUpUserInput } from './dto/signup-user.input';
import { Response } from 'express';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Mutation(() => Boolean)
  async signUp(
    @Args('signUpUserInput') signUpUserInput: SignUpUserInput,
    @Context() { res }: { res: Response },
  ) {
    const { access_token, refresh_token } =
      await this.usersService.signUp(signUpUserInput);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // 개발 환경에서는 false (HTTPS가 아니므로)
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // 개발 환경에서는 false (HTTPS가 아니므로)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return true;
  }

  @Public()
  @Query(() => [User], { name: 'topUsers' })
  async getTopUsers() {
    return this.usersService.findTopByName();
  }
}
