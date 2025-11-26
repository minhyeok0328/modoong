import { Test, TestingModule } from '@nestjs/testing';
import { SportsFacilitiesService } from './sports-facilities.service';
import { SportsFacilitiesApiService } from './services/sports-facilities-api.service';
import { SportsFacilitiesDbService } from './services/sports-facilities-db.service';
import { UsersService } from '../../users/users.service';

describe('SportsFacilitiesService', () => {
  let service: SportsFacilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportsFacilitiesService,
        {
          provide: SportsFacilitiesApiService,
          useValue: {},
        },
        {
          provide: SportsFacilitiesDbService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SportsFacilitiesService>(SportsFacilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
