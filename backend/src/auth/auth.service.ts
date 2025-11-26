import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from '@prisma/client';

const REFRESH_TOKEN_EXPIRES_IN = '30d';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async validateUser(username: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }

    if (user.status !== 'active') {
      return null;
    }

    return user;
  }

  async generateTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: user.id,
      username: user.name,
      address: user.address,
      accessibilityStatus: user.accessibilityStatus,
      activitySchedule: user.activitySchedule,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      sportPreference: (user as any).sportPreference,
      userType: user.userType,
      // UserType 2 fields
      gender: (user as any).gender,
      ageGroup: (user as any).ageGroup,
      phoneNumber: (user as any).phoneNumber,
      email: (user as any).email,
      roles: (user as any).roles,
      volunteerExperience: (user as any).volunteerExperience,
      vmsId: (user as any).vmsId,
      assistantCertificate: (user as any).assistantCertificate,
      hourlyRate: (user as any).hourlyRate,
      guardianNotifications: (user as any).guardianNotifications,
      guardianLinkedAccount: (user as any).guardianLinkedAccount,
      assistantServices: (user as any).assistantServices,
      volunteerActivities: (user as any).volunteerActivities,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }),
    };
  }

  login(user: User) {
    const payload = { sub: user.id, username: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOne(username);
    if (!user || pass === null) {
      throw new UnauthorizedException();
    }
    return this.generateTokens(user);
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException();
      }

      const blacklistKey = `rtbl:${refreshToken}`;
      const isBlacklisted = await this.cacheManager.get<boolean>(blacklistKey);
      if (isBlacklisted) {
        throw new UnauthorizedException();
      }

      const payload = await this.jwtService.verifyAsync<{
        username: string;
        sub: string;
        exp: number;
      }>(refreshToken, {
        secret: jwtConstants.secret,
      });

      const user = await this.usersService.findOne(payload.username);
      if (!user) {
        throw new UnauthorizedException();
      }

      let ttl = 60 * 60 * 24 * 30; // 30 days
      if (payload?.exp) {
        const remaining = payload.exp - Math.floor(Date.now() / 1000);
        if (remaining > 0) {
          ttl = remaining;
        }
      }

      await this.cacheManager.set(blacklistKey, true, ttl);

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
