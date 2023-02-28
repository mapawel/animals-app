import { v4 } from 'uuid';
import { AnimalSpecies } from './Animal-species.enum';

export class Animal {
  readonly id: string = v4();
  constructor(
    readonly name: string,
    readonly species: AnimalSpecies,
    readonly description: string,
  ) {}
}
