import { AnimalType } from '../entity/Animal-type.enum';

export class AnimalResDTO {
  public readonly insuranceId: string;
  public readonly id: string;
  public readonly name: string;
  public readonly type: AnimalType;
  public readonly description: string;
}
