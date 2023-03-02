import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import { readFile, readdir, writeFile, unlink } from 'fs/promises';
import { Animal } from '../entity/Animal';
import { AnimalType } from 'src/animals/entity/Animal-type.enum';
import { UpdateAnimalDTO } from 'src/animals/dto/update-animal.dto';

@Injectable()
export class FilesRepository {
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
    const {
      id,
      name,
      type,
    }: { id: string; name: string; type: AnimalType } = animal;
    if (await this.isExisting(name, type))
      throw new ConflictException(
        `Aninmal with name: ${name} and type: ${type} already exists`,
      );
    await writeFile(
      this.filenameWhPath(id, name, type),
      JSON.stringify(animal),
    );
    return animal;
  }

  public async updateOne(
    id: string,
    updateAnimalDTO: UpdateAnimalDTO,
  ): Promise<Animal> {
    const animalToUpdate: Animal = await this.findOne(id);
    const {
      name: name,
      type: type,
    }: { name: string; type: AnimalType } = animalToUpdate;
    const updatedAnimal: Animal = { ...animalToUpdate, ...updateAnimalDTO };
    const {
      id: uid,
      name: uname,
      type: uspecies,
    }: { id: string; name: string; type: AnimalType } = updatedAnimal;

    if (
      (uname !== name || uspecies !== type) &&
      (await this.isExisting(uname, uspecies))
    )
      throw new ConflictException(
        `Aninmal with name: ${uname} and type: ${uspecies} already exists`,
      );

    await this.removeOne(id);
    await writeFile(
      this.filenameWhPath(uid, uname, uspecies),
      JSON.stringify(updatedAnimal),
    );
    return updatedAnimal;
  }

  public async removeOne(id: string): Promise<boolean> {
    const animalToRemove: Animal = await this.findOne(id);
    const {
      name: name,
      type: type,
    }: { name: string; type: AnimalType } = animalToRemove;
    await unlink(this.filenameWhPath(id, name, type));
    return true;
  }

  public async isExisting(
    name: string,
    type: AnimalType,
  ): Promise<boolean> {
    for (const file of await this.readDBFolder()) {
      const nameAndType: string = file.split(':')[1].split('.')[0];
      if (nameAndType === `${name}${type}`) return true;
    }
    return false;
  }

  private filenameWhPath(
    id: string,
    name: string,
    type: AnimalType,
  ): string {
    return `${path.join(this.pathToDBFiles(), `${id}:${name}${type}`)}.txt`;
  }

  private pathToDBFiles(): string {
    return path.join(process.cwd(), 'files', 'animals');
  }

  private async readDBFolder(): Promise<string[]> {
    return await readdir(this.pathToDBFiles());
  }
}
