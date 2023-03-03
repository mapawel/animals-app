import { Animal } from '../entity/Animal';
import { AnimalType } from '../entity/Animal-type.enum';
import { UpdateAnimalDTO } from '../dto/update-animal.dto';

export interface IAnimalsRepoService {
  findAll(): Promise<Animal[]>;
  findOne(id: string): Promise<Animal>;
  createOne(animal: Animal): Promise<Animal>;
  updateOne(id: string, updateAnimalDTO: UpdateAnimalDTO): Promise<Animal>;
  removeOne(id: string): Promise<boolean>;
  isExisting(name: string, type: AnimalType): Promise<boolean>;
}
