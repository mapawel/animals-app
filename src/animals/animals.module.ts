import { Module } from '@nestjs/common';
import { FilesRepository } from './repository/files.repository';
import { AnimalsController } from './controller/animals.controller';
import { AnimalsService } from './provider/animals.service';

@Module({
  controllers: [AnimalsController],
  providers: [AnimalsService, FilesRepository],
})
export class AnimalsModule {}
