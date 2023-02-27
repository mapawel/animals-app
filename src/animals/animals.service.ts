import { Injectable } from '@nestjs/common';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { AnimalSpecies } from './entity/Animal-species.enum';

@Injectable()
export class AnimalsService {
  public findAll(): string {
    return 'returning all animals';
  }

  public findOne(id: string): string {
    return `returning selected animal: ${id}`;
  }

  public updateOne(id: string, updateAnimalDTO: UpdateAnimalDTO): string {
    return `updating selected animal: ${id} with data: ${updateAnimalDTO}`;
  }

  public createOne(createAnimalDTO: CreateAnimalDTO): string {
    return `creating animals with data: ${JSON.stringify(createAnimalDTO)}`;
  }

  public createMany(createAnimalDTOs: CreateAnimalDTO[]): string {
    return `creating animals with data: ${createAnimalDTOs}`;
  }

  public creatingManyOfType(
    species: AnimalSpecies,
    updateAnimalDTOs: UpdateAnimalDTO[],
  ): string {
    return `creating a group of ${species} with data: ${updateAnimalDTOs}`;
  }
}
