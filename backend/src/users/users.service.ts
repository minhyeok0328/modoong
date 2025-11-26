import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpUserInput } from './dto/signup-user.input';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { BASE_LAT, BASE_LNG } from '../common/utils/geocoding.util';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  async signUp(signUpUserInput: SignUpUserInput) {
    const {
      accessibilityStatus,
      activitySchedule,
      sportPreference,
      otherSportDescription,
      otherDisabilityDescription,
      location,
      ...restInput
    } = signUpUserInput;

    // 1. Convert accessibilityStatus codes to disability_type ids string (e.g., "1,2")
    let accessibilityStatusStr: string | null = null;
    if (accessibilityStatus && Object.keys(accessibilityStatus).length > 0) {
      const selectedDisabilityCodes = Object.entries(accessibilityStatus)
        .filter(([, selected]) => selected)
        .map(([code]) => code);

      if (selectedDisabilityCodes.length > 0) {
        const disabilityTypeRows = await this.prisma.disabilityType.findMany({
          where: {
            code: { in: selectedDisabilityCodes },
          },
          select: { id: true },
        });
        const ids = disabilityTypeRows.map((row) => row.id.toString());
        if (ids.length) {
          accessibilityStatusStr = ids.join(',');
        }
      }
    }

    // 2. Convert sportPreference array to string
    let sportPreferenceStr: string | null = null;
    if (sportPreference && sportPreference.length > 0) {
      sportPreferenceStr = sportPreference.join(',');
    }

    const userData: any = {
      ...restInput,
      status: 'active',
      address:
        '경기 용인시 기흥구 서그내로53번길 23',
      accessibilityStatus: accessibilityStatusStr ?? undefined,
      activitySchedule: activitySchedule,
      sportPreference: sportPreferenceStr ?? undefined,
      otherSportDescription,
      otherDisabilityDescription,
    };

    // Demo: Hardcode location values regardless of input
    (userData as Record<string, any>).address = '경기 용인시 기흥구 서그내로53번길 23';
    (userData as Record<string, any>).latitude = 37.2413052297472;
    (userData as Record<string, any>).longitude = 127.071756095713;

    const user = await this.prisma.user.create({
      data: userData,
    });

    const tokens = await this.authService.generateTokens(user);
    return tokens;
  }

  async findTopByName(): Promise<User[]> {
    return this.prisma.user.findMany({
      take: 10,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(username: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        name: username,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
