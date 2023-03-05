import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from '../animals.service';
import { AnimalsRepository } from '../../repositories/animals.repository';
import { FilesRepo } from '../../repositories/files-repo.service';
import { IAnimalsRepoService } from '../../repositories/animals-repo-service.interface';
import { Setup } from '../../../../__tests__/global-test.setup';
import { Animal } from '../../entity/Animal';
import { AnimalResDTO } from 'src/animals/dto/animal-res.dto';

describe('AnimalsService test suite:', () => {
  let setup: Setup;
  let animalsService: AnimalsService;
  let animalsRepository: AnimalsRepository;
  let filesRepo: IAnimalsRepoService;

  beforeEach(async () => {
    setup = new Setup({
      testDbPathStringsArr: ['__tests__', 'files', 'animals'],
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        AnimalsRepository,
        {
          provide: 'IAnimalsRepoService',
          useValue: new FilesRepo(['files', 'animals']),
        },
      ],
    }).compile();

    animalsService = await module.resolve<AnimalsService>(AnimalsService);
    animalsRepository = await module.resolve<AnimalsRepository>(
      AnimalsRepository,
    );
    filesRepo = await module.resolve<IAnimalsRepoService>(
      'IAnimalsRepoService',
    );
  });

  it('AnimaslService should be defined', () => {
    expect(animalsService).toBeDefined();
  });

  it('AnimalsRepositury should be defined', () => {
    expect(animalsRepository).toBeDefined();
  });

  it('FilesService should be defined', () => {
    expect(filesRepo).toBeDefined();
  });

  describe('findAll() tests:', () => {
    it('should evoke findAll() from animalRepository and return Array of AnialResDTOs', async () => {
      //given
      const findAllAnimalRepoSpy = jest
        .spyOn(animalsRepository, 'findAll')
        .mockImplementation(async () => [setup.animal1, setup.animal2]);

      //when
      const expectedAnimalDTOs: AnimalResDTO[] = await animalsService.findAll();

      //then
      expect(findAllAnimalRepoSpy).toBeCalledTimes(1);
      expect(setup.sortAnimalsById(expectedAnimalDTOs)).toEqual(
        setup.sortAnimalsById([setup.animal1ResDTO, setup.animal2ResDTO]),
      );
    });
  });
  // .... rest test to implement
});
