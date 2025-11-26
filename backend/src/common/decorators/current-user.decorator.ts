import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // GraphQL context에서 request 객체 가져오기
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<{ req: { user: CurrentUserType } }>().req;

    // AuthGuard에서 설정한 user 정보 반환
    return request.user;
  },
);

export interface CurrentUserType {
  sub: string;
  username: string;
  address?: string;
  accessibilityStatus?: string;
  activitySchedule?: Record<string, any>;
  sportPreference?: string;
  iat?: number;
  exp?: number;
}
