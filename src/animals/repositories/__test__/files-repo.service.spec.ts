import { FilesRepo } from '../files-repo.service';
import { Setup } from '../../../../__tests__/global-test.setup';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FilesRepoException } from '../exceptions/Files-repp.exception';

describe('Files repository test suite:', () => {
  let setup: Setup;
  let filesRepo: FilesRepo;
  const stringsPathToTestDBFolder: string[] = ['__tests__', 'files', 'animals'];

  beforeEach(async () => {
    setup = new Setup({
      testDbPathStringsArr: stringsPathToTestDBFolder,
    });
    filesRepo = new FilesRepo(stringsPathToTestDBFolder);
    await setup.removeTestDBFiles();
  });

  afterAll(async () => {
    await setup.removeTestDBFiles();
  });

  describe('createOne() + findAll() methods testing:', () => {
    it('should save 2 animals in 2 files in local test folder, then it should return 2 animals', async () => {
      //when+then
      await Promise.all([
        filesRepo.createOne(setup.animal1),
        filesRepo.createOne(setup.animal2),
      ]);

      expect((await setup.readTestDBFolder()).length).toEqual(2);

      expect(setup.sortAnimalsById(await filesRepo.findAll())).toEqual(
        setup.sortAnimalsById([setup.animal1, setup.animal2]),
      );
    });

    it('should throw ConflictException on try to save an animal with not unique insurance ID', async () => {
      //given
      await filesRepo.createOne(setup.animal1);

      //when+then
      await expect(
        async () =>
          await filesRepo.createOne({
            ...setup.animal2,
            insuranceId: setup.animal1.insuranceId,
          }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw FilesRepoException on try to save an animal to non existing folder', async () => {
      //given
      const anotherFilesRepo = new FilesRepo(['non', 'existing']);
      // when+then
      await expect(
        async () => await anotherFilesRepo.createOne(setup.animal1),
      ).rejects.toThrow(FilesRepoException);
    });

    it('should throw FilesRepoException on try to findAll from non existing folder', async () => {
      //given
      const anotherFilesRepo = new FilesRepo(['non', 'existing']);
      // when+then
      await expect(async () => anotherFilesRepo.findAll()).rejects.toThrow(
        FilesRepoException,
      );
    });
  });

  describe('createOne() + findOne() methods testing:', () => {
    it('should save 2 animals, then it should return proper animal by its id', async () => {
      //when+then
      await Promise.all([
        filesRepo.createOne(setup.animal1),
        filesRepo.createOne(setup.animal2),
      ]);

      const expectedAnimal1 = await filesRepo.findOne(setup.animal1.id);
      const expectedAnimal2 = await filesRepo.findOne(setup.animal2.id);

      expect(expectedAnimal1).toEqual(setup.animal1);
      expect(expectedAnimal2).toEqual(setup.animal2);
    });

    it('should throw FilesRepoException on try to findOne from non existing folder', async () => {
      //given
      const anotherFilesRepo = new FilesRepo(['non', 'existing']);
      // when+then
      await expect(async () =>
        anotherFilesRepo.findOne(setup.animal1.id),
      ).rejects.toThrow(FilesRepoException);
    });
  });

  describe('createOne() + updateOne() methods testing:', () => {
    it('should save animal, then it should update proper animal', async () => {
      await filesRepo.createOne(setup.animal1);

      //when
      await filesRepo.updateOne(setup.animal1.id, setup.animal2);

      // then
      const expectedUpdatedAnimal1 = await filesRepo.findOne(setup.animal1.id);
      expect(expectedUpdatedAnimal1).toEqual({
        ...setup.animal2,
        id: setup.animal1.id,
        insuranceId: setup.animal1.insuranceId,
      });
    });

    it('should throw FilesRepoException on try to updateOne from non existing folder', async () => {
      //given
      const anotherFilesRepo = new FilesRepo(['non', 'existing']);
      // when+then
      await expect(async () =>
        anotherFilesRepo.updateOne(setup.animal1.id, setup.animal2),
      ).rejects.toThrow(FilesRepoException);
    });
  });

  describe('createOne() + removeOne() methods testing:', () => {
    it('should save animal, then it should remove this animal and so throw NotFoundException on try to fineOne([removedAnimal])', async () => {
      await filesRepo.createOne(setup.animal1);

      //when
      await filesRepo.removeOne(setup.animal1.id);

      // then
      await expect(
        async () => await filesRepo.findOne(setup.animal1.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw FilesRepoException on try to removeOne from non existing folder', async () => {
      //given
      const anotherFilesRepo = new FilesRepo(['non', 'existing']);
      // when+then
      await expect(async () =>
        anotherFilesRepo.removeOne(setup.animal1.id),
      ).rejects.toThrow(FilesRepoException);
    });
  });

  describe('createOne() + isExisting() methods testing:', () => {
    it('should save animal, then it should return true on check isExisting([createdAnimal])', async () => {
      //given
      await filesRepo.createOne(setup.animal1);

      //when
      const expectedTrue = await filesRepo.isExisting(
        setup.animal1.insuranceId,
      );

      // then
      expect(expectedTrue).toBeTruthy();
    });

    it('should return false on check isExisting([nonExistingAnimal])', async () => {
      //when
      const expectedFalse = await filesRepo.isExisting(
        setup.animal1.insuranceId,
      );

      // then
      expect(expectedFalse).toBeFalsy();
    });
  });
});
