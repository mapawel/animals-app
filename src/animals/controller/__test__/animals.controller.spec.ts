import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AnimalsController } from '../animals.controller';
import { AnimalsService } from '../../service/animals.service';
import { AnimalsRepository } from '../../repositories/animals.repository';
import { FilesRepo } from '../../repositories/files-repo.service';
import { IAnimalsRepoService } from '../../repositories/animals-repo-service.interface';
import { Setup } from '../../../../__tests__/global-test.setup';

describe('AnimalsController', () => {
  let setup: Setup;
  let controller: AnimalsController;
  let animalsService: AnimalsService;
  let animalsRepository: AnimalsRepository;
  let filesRepo: IAnimalsRepoService;
  let app: INestApplication;

  beforeEach(async () => {
    setup = new Setup({
      testDbPathStringsArr: ['__tests__', 'files', 'animals'],
    });
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [
        AnimalsService,
        AnimalsRepository,
        {
          provide: 'IAnimalsRepoService',
          useValue: new FilesRepo(['__tests__', 'files', 'animals']),
        },
      ],
    }).compile();

    controller = module.get<AnimalsController>(AnimalsController);
    animalsService = await module.resolve<AnimalsService>(AnimalsService);
    animalsRepository = await module.resolve<AnimalsRepository>(
      AnimalsRepository,
    );
    filesRepo = await module.resolve<IAnimalsRepoService>(
      'IAnimalsRepoService',
    );

    app = module.createNestApplication();
    await app.init();
    await setup.removeTestDBFiles();
  });

  afterAll(async () => {
    await setup.removeTestDBFiles();
  });

  it('Controller be defined', () => {
    expect(controller).toBeDefined();
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

  it('/animals/all (GET)', async () => {
    const serviceFindAllspy = jest
      .spyOn(animalsService, 'findAll')
      .mockImplementation(async () => [setup.animal1, setup.animal2]);

    //when
    const response: request.Response = await request(app.getHttpServer()).get(
      '/animals/all',
    );

    //then
    expect(serviceFindAllspy).toBeCalledTimes(1);
    expect(setup.sortAnimalsById(response.body)).toEqual(
      setup.sortAnimalsById([setup.animal1ResDTO, setup.animal2ResDTO]),
    );
  });

  //.. more tests similar to the one above and animals.service.spec.ts
});
