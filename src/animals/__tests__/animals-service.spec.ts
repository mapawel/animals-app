import { Test, TestingModule } from '@nestjs/testing';
import { AnimalType } from '../entity/Animal-type.enum';
import { AnimalsService } from '../provider/animals.service';
import { FilesRepository } from '../repository/files.repository';

describe('AnimalsService tests suite:', () => {
  let animalService: AnimalsService;
  let filesRepository: FilesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalsService, FilesRepository],
    }).compile();

    animalService = await module.resolve<AnimalsService>(AnimalsService);
    filesRepository = await module.resolve<FilesRepository>(FilesRepository);
  });

  it('AnimalService should be defined', () => {
    expect(animalService).toBeDefined();
  });

  it('FilesService should be defined', () => {
    expect(filesRepository).toBeDefined();
  });

  describe('AnimalService methods testing:', () => {
    it('should call a connected repository method on calling findAll()', () => {
      const findAllSpy = jest.spyOn(filesRepository, 'findAll');

      //when
      animalService.findAll();

      //then
      expect(findAllSpy).toBeCalled();
    });

    it('should call a connected repository method on calling findOne()', () => {
      const findOneSpy = jest
        .spyOn(filesRepository, 'findOne')
        .mockImplementationOnce(
          async () =>
            await {
              id: 'qwe',
              name: 'qwe',
              type: AnimalType.CAT,
              description: 'qwe',
            },
        );

      //when
      animalService.findOne('mockedStringId');

      //then
      expect(findOneSpy).toBeCalled();
    });

    it('should call a connected repository method on calling createOne()', () => {
      const createOneSpy = jest
        .spyOn(filesRepository, 'createOne')
        .mockImplementationOnce(
          async () =>
            await {
              id: 'qwe',
              name: 'qwe',
              type: AnimalType.CAT,
              description: 'qwe',
            },
        );

      //when
      animalService.createOne({
        name: 'qwe',
        type: AnimalType.CAT,
        description: 'qwe',
      });

      //then
      expect(createOneSpy).toBeCalled();
    });
  });
});
