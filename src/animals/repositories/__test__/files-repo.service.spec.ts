import { FilesRepo } from '../files-repo.service';
import { Setup } from '../../../../__tests__/global-test.setup';
import { ConflictException } from '@nestjs/common';
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
});
