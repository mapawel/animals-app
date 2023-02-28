import { AnimalSpecies } from '../entity/Animal-species.enum';

export class CreateAnimalDTO {
  public readonly name: string;
  public readonly species: AnimalSpecies;
  public readonly description: string;
}
