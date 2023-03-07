import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import { readFile, readdir, writeFile, unlink } from 'fs/promises';
import { Animal } from '../entity/Animal';
import { UpdateAnimalDTO } from 'src/animals/dto/update-animal.dto';
import { IAnimalsRepoService } from './animals-repo-service.interface';
import { FilesRepoException } from './exceptions/Files-repp.exception';

@Injectable()
export class FilesRepo implements IAnimalsRepoService {
  constructor(private readonly DBpathStrings: string[]) {}

  public async findAll(): Promise<Animal[]> {
    try {
      const animals: Animal[] = [];
      for (const file of await this.readDBFolder()) {
        const buffer = await readFile(path.join(this.pathToDBFiles(), file));
        animals.push(JSON.parse(buffer.toString()));
      }
      return animals;
    } catch (err: any) {
      throw new FilesRepoException('Error while reading the DB files');
    }
  }

  public async findOne(id: string): Promise<Animal> {
    try {
      for (const file of await this.readDBFolder()) {
        const fileId: string = file.split(':')[0];
        if (fileId === id) {
          const buffer = await readFile(path.join(this.pathToDBFiles(), file));
          return JSON.parse(buffer.toString());
        }
      }
      throw new NotFoundException(`Animal with id: ${id} not found`);
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      throw new FilesRepoException(
        'Error while reading the DB file' + err.message,
      );
    }
  }

  public async createOne(animal: Animal): Promise<Animal> {
    try {
      const { insuranceId, id }: { insuranceId: string; id: string } = animal;
      if (await this.isExisting(insuranceId))
        throw new ConflictException(
          `Aninmal with insurance ID: ${insuranceId} already exists`,
        );

      await this.writeToFile(
        this.filenameWhPath(id, insuranceId),
        JSON.stringify(animal),
      );

      return animal;
    } catch (err: any) {
      if (err instanceof ConflictException) throw err;
      throw new FilesRepoException('Error while writing the DB file');
    }
  }

  public async updateOne(
    id: string,
    updateAnimalDTO: UpdateAnimalDTO,
  ): Promise<Animal> {
    try {
      const animalToUpdate: Animal = await this.findOne(id);
      const { insuranceId }: { insuranceId: string } = animalToUpdate;

      const updatedAnimal: Animal = {
        ...animalToUpdate,
        ...updateAnimalDTO,
        insuranceId,
        id,
      };

      await this.writeToFile(
        this.filenameWhPath(id, insuranceId),
        JSON.stringify(updatedAnimal),
      );
      return updatedAnimal;
    } catch (err: any) {
      throw new FilesRepoException('Error while updaing the DB file');
    }
  }

  public async removeOne(id: string): Promise<boolean> {
    try {
      const animalToRemove: Animal = await this.findOne(id);
      const { insuranceId }: { insuranceId: string } = animalToRemove;
      await unlink(this.filenameWhPath(id, insuranceId));
      return true;
    } catch (err: any) {
      throw new FilesRepoException('Error while removing the DB file');
    }
  }

  public async isExisting(insuranceId: string): Promise<boolean> {
    for (const file of await this.readDBFolder()) {
      const fileIID: string = file.split(':')[1].split('.')[0];
      if (fileIID === insuranceId) return true;
    }
    return false;
  }

  private filenameWhPath(id: string, insuranceId: string): string {
    return `${path.join(this.pathToDBFiles(), `${id}:${insuranceId}`)}.txt`;
  }

  private pathToDBFiles(): string {
    return path.join(process.cwd(), ...this.DBpathStrings);
  }

  private async readDBFolder(): Promise<string[]> {
    try {
      return await readdir(this.pathToDBFiles());
    } catch (err: any) {
      throw new FilesRepoException('Error while reading folder with DB files.');
    }
  }

  private async writeToFile(name: string, data: string): Promise<void> {
    const dataBuffer: Buffer = Buffer.from(data);
    await writeFile(name, dataBuffer);
  }
}
