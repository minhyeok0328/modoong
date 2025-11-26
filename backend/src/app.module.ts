import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { FacilitiesModule } from './facilities/facilities.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommonResolver } from './common/resolver/common.resolver';
import { EssayModule } from './essay/essay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        const formattedError: Record<string, unknown> = {
          message: error.message,
        };

        if (error.extensions?.code) {
          formattedError['extensions'] = { code: error.extensions.code };
        }

        if (error.path) {
          formattedError['path'] = error.path;
        }

        return formattedError as unknown as import('graphql').GraphQLFormattedError;
      },
    }),
    AuthModule,
    UsersModule,
    CacheModule.register({
      ttl: 5000,
      isGlobal: true,
    }),
    FacilitiesModule,
    PrismaModule,
    EssayModule,
  ],
  providers: [AppService, AppResolver, CommonResolver],
})
export class AppModule {}
