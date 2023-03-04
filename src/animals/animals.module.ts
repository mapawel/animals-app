import { Module } from '@nestjs/common';
import { AnimalsRepository } from './repositories/animals.repository';
import { AnimalsController } from './controller/animals.controller';
import { AnimalsService } from './service/animals.service';
import { FilesRepo } from './repositories/files-repo.service';

@Module({
  controllers: [AnimalsController],
  providers: [
    AnimalsService,
    AnimalsRepository,
    {
      provide: 'IAnimalsRepoService',
      useValue: new FilesRepo(['files', 'animals']),
    },
  ],
})
export class AnimalsModule {}
