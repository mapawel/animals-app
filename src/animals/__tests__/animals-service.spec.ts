import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from './animals-service';

describe('AnimalsService', () => {
  let provider: AnimalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalsService],
    }).compile();

    provider = module.get<AnimalsService>(AnimalsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
