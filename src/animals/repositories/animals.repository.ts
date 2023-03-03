import { Injectable, Inject } from '@nestjs/common';
import { Animal } from '../entity/Animal';
import { AnimalType } from 'src/animals/entity/Animal-type.enum';
import { UpdateAnimalDTO } from 'src/animals/dto/update-animal.dto';
import { IAnimalsRepoService } from './animals-repo-service.interface';

@Injectable()
export class AnimalsRepository {
  constructor(
    @Inject('IAnimalsRepoService')
    private readonly repositoryService: IAnimalsRepoService,
  ) {}

  public async findAll(): Promise<Animal[]> {
    return await this.repositoryService.findAll();
  }

  public async findOne(id: string): Promise<Animal> {
    return await this.repositoryService.findOne(id);
  }

  public async createOne(animal: Animal): Promise<Animal> {
    return await this.repositoryService.createOne(animal);
  }

  public async updateOne(
    id: string,
    updateAnimalDTO: UpdateAnimalDTO,
  ): Promise<Animal> {
    return await this.repositoryService.updateOne(id, updateAnimalDTO);
  }

  public async removeOne(id: string): Promise<boolean> {
    return await this.repositoryService.removeOne(id);
  }

  public async isExisting(name: string, type: AnimalType): Promise<boolean> {
    return await this.repositoryService.isExisting(name, type);
  }
}
