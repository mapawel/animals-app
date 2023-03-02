import { AnimalType } from '../entity/Animal-type.enum';
import { IsNotEmpty, IsString, IsEnum, Length } from 'class-validator';

export class CreateAnimalDTO {
  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @IsEnum(AnimalType)
  public readonly type: AnimalType;

  @IsString()
  @Length(0, 100)
  public readonly description: string;
}
