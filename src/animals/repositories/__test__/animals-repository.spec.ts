import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsRepository } from '../animals.repository';
import { FilesRepo } from '../files-repo.service';
import { IAnimalsRepoService } from '../animals-repo-service.interface';

describe('AnimalsRepository test suite:', () => {
  let animalsRepository: AnimalsRepository;
  let filesRepo: IAnimalsRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsRepository,
        {
          provide: 'IAnimalsRepoService',
          useValue: new FilesRepo(['files', 'animals']),
        },
      ],
    }).compile();

    animalsRepository = await module.resolve<AnimalsRepository>(
      AnimalsRepository,
    );
    filesRepo = await module.resolve<IAnimalsRepoService>(
      'IAnimalsRepoService',
    );
  });

  it('AnimalService should be defined', () => {
    expect(animalsRepository).toBeDefined();
  });

  it('FilesService should be defined', () => {
    expect(filesRepo).toBeDefined();
  });
});
