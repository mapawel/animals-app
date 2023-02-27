import { uuid as uuidv4 } from 'uuidv4';
import { AnimalSpecies } from './Animal-species.enum';

export class Animal {
  readonly id: string = uuidv4();
  constructor(
    readonly name: string,
    readonly species: AnimalSpecies,
    readonly description: string,
  ) {}
}
