import { v4 } from 'uuid';
import { AnimalType } from './Animal-type.enum';

export class Animal {
  readonly id: string = v4();
  constructor(
    readonly insuranceId: string,
    readonly name: string,
    readonly type: AnimalType,
    readonly description: string,
  ) {}
}
