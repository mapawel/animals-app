import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import { readFile, readdir, writeFile, unlink } from 'fs/promises';
import { Animal } from '../animals/entity/Animal';
import { AnimalSpecies } from 'src/animals/entity/Animal-species.enum';
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

  public async updateOne(
    id: string,
    updateAnimalDTO: UpdateAnimalDTO,
  ): Promise<Animal> {
    const animalToUpdate: Animal = await this.findOne(id);
    const {
      name: name,
      species: species,
    }: { name: string; species: AnimalSpecies } = animalToUpdate;
    const updatedAnimal: Animal = { ...animalToUpdate, ...updateAnimalDTO };
    const {
      id: uid,
      name: uname,
      species: uspecies,
    }: { id: string; name: string; species: AnimalSpecies } = updatedAnimal;

    if (
      (uname !== name || uspecies !== species) &&
      (await this.isExisting(uname, uspecies))
    )
      throw new ConflictException(
        `Aninmal with name: ${uname} and species: ${uspecies} already exists`,
      );

    await this.removeOne(id);
    await writeFile(
      this.filenameWhPath(uid, uname, uspecies),
      JSON.stringify(updatedAnimal),
    );
    return updatedAnimal;
  }

  public async createOne(animal: Animal): Promise<Animal> {
    const {
      id,
      name,
      species,
    }: { id: string; name: string; species: AnimalSpecies } = animal;
    if (await this.isExisting(name, species))
      throw new ConflictException(
        `Aninmal with name: ${name} and species: ${species} already exists`,
      );
    await writeFile(
      this.filenameWhPath(id, name, species),
      JSON.stringify(animal),
    );
    return animal;
  }

  public async removeOne(id: string): Promise<boolean> {
    const animalToRemove: Animal = await this.findOne(id);
    const {
      name: name,
      species: species,
    }: { name: string; species: AnimalSpecies } = animalToRemove;
    await unlink(this.filenameWhPath(id, name, species));
    return true;
  }

  private async isExisting(
    name: string,
    species: AnimalSpecies,
  ): Promise<boolean> {
    for (const file of await this.readDBFolder()) {
      const nameAndSpecies: string = file.split(':')[1].split('.')[0];
      if (nameAndSpecies === `${name}${species}`) return true;
    }
    return false;
  }

  private filenameWhPath(
    id: string,
    name: string,
    species: AnimalSpecies,
  ): string {
    return `${path.join(this.pathToDBFiles(), `${id}:${name}${species}`)}.txt`;
  }

  private pathToDBFiles(): string {
    return path.join(process.cwd(), 'files', 'animals');
  }

  private async readDBFolder(): Promise<string[]> {
    return await readdir(this.pathToDBFiles());
  }
}
