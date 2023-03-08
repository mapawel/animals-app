import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { AnimalsService } from '../animals.service';
import { AnimalsRepository } from '../../repositories/animals.repository';
import { FilesRepo } from '../../repositories/files-repo.service';
import { IAnimalsRepoService } from '../../repositories/animals-repo-service.interface';
import { Setup } from '../../../../__tests__/global-test.setup';
import { AnimalType } from '../../entity/Animal-type.enum';
import { AnimalResDTO } from '../../dto/animal-res.dto';

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
          useValue: new FilesRepo(['__tests__', 'files', 'animals']),
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

    await setup.removeTestDBFiles();
  });

  afterAll(async () => {
    await setup.removeTestDBFiles();
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

  describe('findOne() tests:', () => {
    it('should evoke findOne() from animalRepository and return mocked AnialResDTOs by id of the animal', async () => {
      //given
      const findOneAnimalRepoSpy = jest
        .spyOn(animalsRepository, 'findOne')
        .mockImplementation(async () => setup.animal1);

      //when
      const expectedAnimalDTO: AnimalResDTO = await animalsService.findOne(
        setup.animal1.id,
      );

      //then
      expect(findOneAnimalRepoSpy).toBeCalledTimes(1);
      expect(expectedAnimalDTO).toEqual(setup.animal1ResDTO);
    });
  });

  describe('createOne() tests:', () => {
    it('should evoke createOne() from animalRepository and return mocked AnialResDTOs of created animal', async () => {
      //given
      const createOneAnimalRepoSpy = jest
        .spyOn(animalsRepository, 'createOne')
        .mockImplementation(async () => setup.animal1);

      //when
      const expectedAnimalDTO: AnimalResDTO = await animalsService.createOne(
        setup.animal1createDTO,
      );

      //then
      expect(createOneAnimalRepoSpy).toBeCalledTimes(1);
      expect(expectedAnimalDTO).toEqual(setup.animal1ResDTO);
    });
  });

  describe('updateOne() tests:', () => {
    it('should evoke updateOne() from animalRepository and return mocked AnialResDTOs of updated animal', async () => {
      //given
      const updateOneAnimalRepoSpy = jest
        .spyOn(animalsRepository, 'updateOne')
        .mockImplementation(async () => ({
          ...setup.animal2,
          id: setup.animal1.id,
          insuranceId: setup.animal1.insuranceId,
        }));

      //when
      const expectedAnimalDTO: AnimalResDTO = await animalsService.updateOne(
        setup.animal1.id,
        setup.animal1createDTO,
      );

      //then
      expect(updateOneAnimalRepoSpy).toBeCalledTimes(1);
      expect(expectedAnimalDTO).toEqual({
        ...setup.animal2ResDTO,
        id: setup.animal1ResDTO.id,
        insuranceId: setup.animal1ResDTO.insuranceId,
      });
    });
  });

  describe('removeOne() tests:', () => {
    it('should evoke removeOne() from animalRepository and return true', async () => {
      //given
      const removeOneAnimalRepoSpy = jest
        .spyOn(animalsRepository, 'removeOne')
        .mockImplementation(async () => true);

      //when
      const expectedTrue: boolean = await animalsService.removeOne(
        setup.animal1.id,
      );

      //then
      expect(removeOneAnimalRepoSpy).toBeCalledTimes(1);
      expect(expectedTrue).toBeTruthy();
    });
  });

  describe('createMany() tests:', () => {
    it('should evoke createOne() from animalRepository 2 times and return array of newly created animal DTOs', async () => {
      //given
      const createOneRepoSpy = jest
        .spyOn(animalsRepository, 'createOne')
        .mockImplementationOnce(async () => setup.animal1)
        .mockImplementationOnce(async () => setup.animal2);

      //when
      const expectedAnimalsDTOsArr: AnimalResDTO[] =
        await animalsService.createMany([
          setup.animal1createDTO,
          setup.animal2createDTO,
        ]);

      //then
      expect(createOneRepoSpy).toBeCalledTimes(2);
      expect(setup.sortAnimalsById(expectedAnimalsDTOsArr)).toEqual(
        setup.sortAnimalsById([setup.animal1ResDTO, setup.animal2ResDTO]),
      );
    });

    it('should throw ConflictException on try to create new animals where at least one of them with existing in DB insurance ID', async () => {
      //given
      await animalsService.createOne(setup.animal2createDTO);

      //when+then
      expect(async () => {
        await animalsService.createMany([
          setup.animal1createDTO,
          setup.animal2createDTO,
        ]);
      }).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException on try to create new animal where insurance IDs are not unique', async () => {
      //when+then
      expect(async () => {
        await animalsService.createMany([
          setup.animal1createDTO,
          {
            ...setup.animal2createDTO,
            insuranceId: setup.animal1createDTO.insuranceId,
          },
        ]);
      }).rejects.toThrow(ConflictException);
    });
  });

  describe('createManyOfTypes() tests:', () => {
    const typeForAllAnimals: AnimalType = AnimalType.CAT;

    it('should evoke createOne() from animalRepository 2 times and return array of newly created and one type animal DTOs (even if types passed in animal DTOs is different)', async () => {
      //given
      const createOneRepoSpy = jest
        .spyOn(animalsRepository, 'createOne')
        .mockImplementationOnce(async () => ({
          ...setup.animal1,
          type: typeForAllAnimals,
        }))
        .mockImplementationOnce(async () => ({
          ...setup.animal2,
          type: typeForAllAnimals,
        }));

      //when
      const expectedAnimalsDTOsArr: AnimalResDTO[] =
        await animalsService.creatingManyOfType(typeForAllAnimals, [
          setup.animal1createDTO,
          setup.animal2createDTO,
        ]);

      //then
      expect(createOneRepoSpy).toBeCalledTimes(2);
      expect(setup.sortAnimalsById(expectedAnimalsDTOsArr)).toEqual(
        setup.sortAnimalsById([
          { ...setup.animal1ResDTO, type: typeForAllAnimals },
          { ...setup.animal2ResDTO, type: typeForAllAnimals },
        ]),
      );
    });

    it('should throw ConflictException on try to create new animals where at least one of them with existing in DB insurance ID', async () => {
      //given
      await animalsService.createOne(setup.animal2createDTO);

      //when+then
      expect(async () => {
        await animalsService.creatingManyOfType(typeForAllAnimals, [
          setup.animal1createDTO,
          setup.animal2createDTO,
        ]);
      }).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException on try to create new animal where insurance IDs are not unique', async () => {
      //when+then
      expect(async () => {
        await animalsService.creatingManyOfType(typeForAllAnimals, [
          setup.animal1createDTO,
          {
            ...setup.animal2createDTO,
            insuranceId: setup.animal1createDTO.insuranceId,
          },
        ]);
      }).rejects.toThrow(ConflictException);
    });
  });
});
