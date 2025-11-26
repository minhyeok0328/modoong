import { Resolver, Query, Field } from '@nestjs/graphql';
import { DisabilityTypeModel } from '../types/disability-type.model';
import { SportTypeModel } from '../types/sport-type.model';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../decorators/public.decorator';

@Resolver()
export class CommonResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Query(() => [DisabilityTypeModel])
  @Field(() => String, {
    description: '장애 유형 목록',
  })
  async disabilityTypes() {
    return this.prisma.disabilityType.findMany({
      select: { id: true, code: true, name: true },
      orderBy: { id: 'asc' },
    });
  }

  @Public()
  @Query(() => [SportTypeModel])
  @Field(() => String, {
    description: '종목 유형 목록',
  })
  async sportTypes() {
    return this.prisma.sportType.findMany({
      select: { id: true, code: true, name: true },
      orderBy: { id: 'asc' },
    });
  }
}
