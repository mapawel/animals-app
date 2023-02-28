import { Injectable } from '@nestjs/common';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { AnimalSpecies } from './entity/Animal-species.enum';
import { Animal } from './entity/Animal';
import { FilesRepository } from '../repository/files.repository';

@Injectable()
export class AnimalsService {
  constructor(private readonly filesRepository: FilesRepository) {}
  public async findAll(): Promise<Animal[]> {
    return await this.filesRepository.findAll();
  }

  public async findOne(id: string): Promise<Animal> {
    return await this.filesRepository.findOne(id);
  }

  public async updateOne(
    id: string,
    updateAnimalDTO: UpdateAnimalDTO,
  ): Promise<Animal> {
    return await this.filesRepository.updateOne(id, updateAnimalDTO);
  }

  public async createOne(createAnimalDTO: CreateAnimalDTO): Promise<Animal> {
    const {
      name,
      species,
      description,
    }: { name: string; species: AnimalSpecies; description: string } =
      createAnimalDTO;
    const newAnimal: Animal = new Animal(name, species, description);
    return await this.filesRepository.createOne(newAnimal);
  }

  public async removeOne(id: string): Promise<boolean> {
    return await this.filesRepository.removeOne(id);
  }

  public createMany(createAnimalDTOs: CreateAnimalDTO[]): string {
    return `creating animals with data: ${createAnimalDTOs}`;
  }

  public creatingManyOfType(
    species: AnimalSpecies,
    updateAnimalDTOs: UpdateAnimalDTO[],
  ): string {
    return `creating a group of ${species} with data: ${updateAnimalDTOs}`;
  }
}
