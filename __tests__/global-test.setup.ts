import { v4 } from 'uuid';
import { AnimalType } from '../src/animals/entity/Animal-type.enum';
import { Animal } from '../src/animals/entity/Animal';
import { unlink, readdir } from 'fs/promises';
import path from 'path';
import { AnimalResDTO } from 'src/animals/dto/animal-res.dto';
import { CreateAnimalDTO } from 'src/animals/dto/create-animal.dto';

export class Setup {
  readonly animal1: Animal = {
    id: v4(),
    insuranceId: '12345',
    name: 'Dog',
    type: AnimalType.DOG,
    description: 'A dog',
  };

  readonly animal1ResDTO: AnimalResDTO = {
    id: this.animal1.id,
    insuranceId: this.animal1.insuranceId,
    name: this.animal1.name,
    type: this.animal1.type,
    description: this.animal1.description,
  };

  readonly animal1createDTO: CreateAnimalDTO = {
    insuranceId: this.animal1.insuranceId,
    name: this.animal1.name,
    type: this.animal1.type,
    description: this.animal1.description,
  };

  readonly animal2: Animal = {
    id: v4(),
    insuranceId: '54321',
    name: 'Cat',
    type: AnimalType.CAT,
    description: 'A cat',
  };

  readonly animal2ResDTO: AnimalResDTO = {
    id: this.animal2.id,
    insuranceId: this.animal2.insuranceId,
    name: this.animal2.name,
    type: this.animal2.type,
    description: this.animal2.description,
  };

  readonly animal2createDTO: CreateAnimalDTO = {
    insuranceId: this.animal2.insuranceId,
    name: this.animal2.name,
    type: this.animal2.type,
    description: this.animal2.description,
  };

  private readonly testDbPathStringsArr: string[];

  constructor(settings: { testDbPathStringsArr: string[] }) {
    this.testDbPathStringsArr = settings.testDbPathStringsArr;
  }

  public sortAnimalsById(
    animals: Animal[] | AnimalResDTO[],
  ): Animal[] | AnimalResDTO[] {
    return animals.sort((x: Animal | AnimalResDTO, y: Animal | AnimalResDTO) =>
      x.id.localeCompare(y.id),
    );
  }

  public async removeTestDBFiles(): Promise<void> {
    const files: string[] = await this.readTestDBFolder();
    for (const file of files) {
      await unlink(path.join(this.pathToTestDBFiles(), file));
    }
  }

  public async readTestDBFolder(): Promise<string[]> {
    return await readdir(this.pathToTestDBFiles());
  }

  private pathToTestDBFiles(): string {
    return path.join(process.cwd(), ...this.testDbPathStringsArr);
  }
}
