import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import { readFile, readdir, writeFile, unlink } from 'fs/promises';
import { createWriteStream, WriteStream } from 'fs';
import { Animal } from '../entity/Animal';
import { UpdateAnimalDTO } from 'src/animals/dto/update-animal.dto';
import { IAnimalsRepoService } from './animals-repo-service.interface';

@Injectable()
export class FilesRepo implements IAnimalsRepoService {
  public async findAll(): Promise<Animal[]> {
    const animals: Animal[] = [];
    for (const file of await this.readDBFolder()) {
      animals.push(
        JSON.parse(
          await readFile(path.join(this.pathToDBFiles(), file), 'utf-8'),
        ),
      );
    }
    return animals;
  }

  public async findOne(id: string): Promise<Animal> {
    for (const file of await this.readDBFolder()) {
      const fileId: string = file.split(':')[0];
      if (fileId === id)
        return JSON.parse(
          await readFile(path.join(this.pathToDBFiles(), file), 'utf-8'),
        );
    }
    throw new NotFoundException(`Animal with id: ${id} not found`);
  }

  public async createOne(animal: Animal): Promise<Animal> {
    const { insuranceId, id }: { insuranceId: string; id: string } = animal;
    if (await this.isExisting(insuranceId))
      throw new ConflictException(
        `Aninmal with insurance ID: ${insuranceId} already exists`,
      );

    await this.writeToFile(
      this.filenameWhPath(id, insuranceId),
      JSON.stringify(animal),
    );
    // await writeFile(
    //   this.filenameWhPath(id, insuranceId),
    //   JSON.stringify(animal),
    // );

    return animal;
  }

  private async writeToFile(name: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream: WriteStream = createWriteStream(name);
      stream.write(data);
      stream.end();
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  public async updateOne(
    id: string,
    updateAnimalDTO: UpdateAnimalDTO,
  ): Promise<Animal> {
    const animalToUpdate: Animal = await this.findOne(id);
    const { insuranceId }: { insuranceId: string } = animalToUpdate;

    const updatedAnimal: Animal = {
      ...animalToUpdate,
      ...updateAnimalDTO,
      insuranceId,
      id,
    };

    await writeFile(
      this.filenameWhPath(id, insuranceId),
      JSON.stringify(updatedAnimal),
    );
    return updatedAnimal;
  }

  public async removeOne(id: string): Promise<boolean> {
    const animalToRemove: Animal = await this.findOne(id);
    const { insuranceId }: { insuranceId: string } = animalToRemove;
    await unlink(this.filenameWhPath(id, insuranceId));
    return true;
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
    return path.join(process.cwd(), 'files', 'animals');
  }

  private async readDBFolder(): Promise<string[]> {
    return await readdir(this.pathToDBFiles());
  }
}
