import { v4 } from 'uuid';
import { AnimalType } from '../src/animals/entity/Animal-type.enum';
import { Animal } from '../src/animals/entity/Animal';
import { unlink, readdir } from 'fs/promises';
import path from 'path';

export class Setup {
  readonly animal1: Animal = {
    id: v4(),
    insuranceId: '12345',
    name: 'Dog',
    type: AnimalType.DOG,
    description: 'A dog',
  };

  readonly animal2: Animal = {
    id: v4(),
    insuranceId: '54321',
    name: 'Cat',
    type: AnimalType.CAT,
    description: 'A cat',
  };

  private readonly testDbPathStringsArr: string[];

  constructor(settings: { testDbPathStringsArr: string[] }) {
    this.testDbPathStringsArr = settings.testDbPathStringsArr;
  }

  public sortAnimalsById(animals: Animal[]): Animal[] {
    return animals.sort((x: Animal, y: Animal) => x.id.localeCompare(y.id));
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
