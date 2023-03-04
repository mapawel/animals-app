import { FilesRepo } from '../files-repo.service';
import { Setup } from '../../../../__tests__/global-test.setup';

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
  });
});
