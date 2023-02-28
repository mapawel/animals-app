import { Module } from '@nestjs/common';
import { FilesRepository } from 'src/repository/files.repository';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';

@Module({
  controllers: [AnimalsController],
  providers: [AnimalsService, FilesRepository],
})
export class AnimalsModule {}
