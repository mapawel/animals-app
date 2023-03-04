import { Injectable, ConflictException } from '@nestjs/common';
import { UpdateAnimalDTO } from '../dto/update-animal.dto';
import { CreateAnimalDTO } from '../dto/create-animal.dto';
import { CreateManyAnimalsDTO } from '../dto/create-many-animals.dto';
import { AnimalResDTO } from '../dto/animal-res.dto';
import { AnimalType } from '../entity/Animal-type.enum';
import { Animal } from '../entity/Animal';
import { AnimalsRepository } from '../repositories/animals.repository';
import { mapToResDTO } from '../dto/animal-dto.mappers';

@Injectable()
export class AnimalsService {
  constructor(private readonly animalsRepository: AnimalsRepository) {}
  public async findAll(): Promise<AnimalResDTO[]> {
    const animals: Animal[] = await this.animalsRepository.findAll();
    return animals.map((animal: Animal) => {
      return mapToResDTO(animal);
    });
  }

  public async findOne(id: string): Promise<AnimalResDTO> {
    const animal: Animal = await this.animalsRepository.findOne(id);
    return mapToResDTO(animal);
  }

  public async createOne(
    createAnimalDTO: CreateAnimalDTO,
  ): Promise<AnimalResDTO> {
    const {
      insuranceId,
      name,
      type,
      description,
    }: {
      insuranceId: string;
      name: string;
      type: AnimalType;
      description: string;
    } = createAnimalDTO;
    const newAnimal: Animal = new Animal(insuranceId, name, type, description);
    const animal: Animal = await this.animalsRepository.createOne(newAnimal);
    return mapToResDTO(animal);
  }

  public async updateOne(
    id: string,
    updateAnimalDTO: UpdateAnimalDTO,
  ): Promise<AnimalResDTO> {
    const animal: Animal = await this.animalsRepository.updateOne(
      id,
      updateAnimalDTO,
    );
    return mapToResDTO(animal);
  }

  public async removeOne(id: string): Promise<boolean> {
    return await this.animalsRepository.removeOne(id);
  }

  public async createMany(
    createAnimalDTOs: CreateAnimalDTO[],
  ): Promise<AnimalResDTO[]> {
    await Promise.all(
      createAnimalDTOs.map(async (animalDTO: CreateAnimalDTO) => {
        if (await this.animalsRepository.isExisting(animalDTO.insuranceId)) {
          throw new ConflictException(
            `Aninmal with insurance ID: ${animalDTO.insuranceId} already exists`,
          );
        }
      }),
    );

    const animals: Animal[] = await Promise.all(
      createAnimalDTOs.map(async (animalDTO: CreateAnimalDTO) => {
        return await this.createOne(animalDTO);
      }),
    );
    return animals.map((animal: Animal) => {
      return mapToResDTO(animal);
    });
  }

  public async creatingManyOfType(
    type: AnimalType,
    updateAnimalDTOs: CreateManyAnimalsDTO[],
  ): Promise<AnimalResDTO[]> {
    const oneTypeAnimalsDTOs: CreateAnimalDTO[] = updateAnimalDTOs.map(
      (animalDTO: CreateManyAnimalsDTO) => {
        return { ...animalDTO, type };
      },
    );

    const animals: Animal[] = await this.createMany(oneTypeAnimalsDTOs);

    return animals.map((animal: Animal) => {
      return mapToResDTO(animal);
    });
  }
}
