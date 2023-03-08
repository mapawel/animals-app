import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsRepository } from '../animals.repository';
import { FilesRepo } from '../files-repo.service';
import { IAnimalsRepoService } from '../animals-repo-service.interface';
import { Setup } from '../../../../__tests__/global-test.setup';
import { Animal } from '../../entity/Animal';

describe('AnimalsRepository test suite:', () => {
  let setup: Setup;
  let animalsRepository: AnimalsRepository;
  let filesRepo: IAnimalsRepoService;

  beforeEach(async () => {
    setup = new Setup({
      testDbPathStringsArr: ['__tests__', 'files', 'animals'],
    });

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

  it('AnimalsRepository should be defined', () => {
    expect(animalsRepository).toBeDefined();
  });

  it('FilesService should be defined', () => {
    expect(filesRepo).toBeDefined();
  });

  describe('findAll() tests:', () => {
    it('should evoke findAll() from repositoryService and return mocked array with Animals', async () => {
      //given
      const findAllFileRepoSpy = jest
        .spyOn(filesRepo, 'findAll')
        .mockImplementation(async () => [setup.animal1, setup.animal2]);

      //when
      const expectedAnimalsArr: Animal[] = await animalsRepository.findAll();

      //then
      expect(findAllFileRepoSpy).toBeCalledTimes(1);
      expect(setup.sortAnimalsById(expectedAnimalsArr)).toEqual(
        setup.sortAnimalsById([setup.animal1, setup.animal2]),
      );
    });
  });

  describe('findOne() tests:', () => {
    it('should evoke findOne() from repositoryService and return mocked Animal by its id', async () => {
      //given
      const findOneFileRepoSpy = jest
        .spyOn(filesRepo, 'findOne')
        .mockImplementation(async () => setup.animal1);

      //when
      const expectedAnimal: Animal = await animalsRepository.findOne(
        setup.animal1.id,
      );

      //then
      expect(findOneFileRepoSpy).toBeCalledTimes(1);
      expect(expectedAnimal).toEqual(setup.animal1);
    });
  });

  describe('createOne() tests:', () => {
    it('should evoke createOne() from repositoryService and return newly created Animal', async () => {
      //given
      const createOneFileRepoSpy = jest
        .spyOn(filesRepo, 'createOne')
        .mockImplementation(async () => setup.animal1);

      //when
      const expectedAnimal: Animal = await animalsRepository.createOne(
        setup.animal1,
      );

      //then
      expect(createOneFileRepoSpy).toBeCalledTimes(1);
      expect(expectedAnimal).toEqual(setup.animal1);
    });
  });

  describe('updateOne() tests:', () => {
    it('should evoke updateOne() from repositoryService and return updated Animal', async () => {
      //given
      const updatedMockAnimal: Animal = {
        ...setup.animal2,
        id: setup.animal1.id,
        insuranceId: setup.animal1.insuranceId,
      };
      const updateOneFileRepoSpy = jest
        .spyOn(filesRepo, 'updateOne')
        .mockImplementation(async () => updatedMockAnimal);

      //when
      const expectedAnimal = await animalsRepository.updateOne(
        setup.animal1.id,
        setup.animal2,
      );

      //then
      expect(updateOneFileRepoSpy).toBeCalledTimes(1);
      expect(expectedAnimal).toEqual(updatedMockAnimal);
    });
  });

  describe('removeOne() tests:', () => {
    it('should evoke removeOne() from repositoryService and return updated Animal', async () => {
      //given
      const removeOneFileRepoSpy = jest
        .spyOn(filesRepo, 'removeOne')
        .mockImplementation(async () => true);

      //when
      const expectedTrue: boolean = await animalsRepository.removeOne(
        setup.animal1.id,
      );

      //then
      expect(removeOneFileRepoSpy).toBeCalledTimes(1);
      expect(expectedTrue).toBeTruthy();
    });
  });

  describe('isExisting() tests:', () => {
    it('should evoke isExisting() from repositoryService and return true', async () => {
      //given
      const isExistingFileRepoSpy = jest
        .spyOn(filesRepo, 'isExisting')
        .mockImplementation(async () => true);

      //when
      const expectedTrue: boolean = await animalsRepository.isExisting(
        setup.animal1.id,
      );

      //then
      expect(isExistingFileRepoSpy).toBeCalledTimes(1);
      expect(expectedTrue).toBeTruthy();
    });
  });
});
