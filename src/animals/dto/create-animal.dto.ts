import { AnimalSpecies } from '../entity/Animal-species.enum';

export class CreateAnimalDTO {
  public name: string;
  public species: AnimalSpecies;
  public description: string;
}
