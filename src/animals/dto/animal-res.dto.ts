import { AnimalSpecies } from '../entity/Animal-species.enum';

export class AnimalResDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly species: AnimalSpecies;
  public readonly description: string;
}
