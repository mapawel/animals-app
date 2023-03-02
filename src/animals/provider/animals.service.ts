import { Injectable, ConflictException } from '@nestjs/common';
import { UpdateAnimalDTO } from '../dto/update-animal.dto';
import { CreateAnimalDTO } from '../dto/create-animal.dto';
import { CreateManyAnimalsDTO } from '../dto/create-many-animals.dto';
import { AnimalResDTO } from '../dto/animal-res.dto';
import { AnimalType } from '../entity/Animal-type.enum';
import { Animal } from '../entity/Animal';
import { FilesRepository } from '../repository/files.repository';
import { AnimalDTOMapper } from '../dto-mappers/animal-dto.mapper';

@Injectable()
export class AnimalsService {
  constructor(private readonly filesRepository: FilesRepository) {}
  public async findAll(): Promise<AnimalResDTO[]> {
    const animals: Animal[] = await this.filesRepository.findAll();
    return animals.map((animal: Animal) => {
      return AnimalDTOMapper.mapToResDTO(animal);
    });
  }

  public async findOne(id: string): Promise<AnimalResDTO> {
    const animal: Animal = await this.filesRepository.findOne(id);
    return AnimalDTOMapper.mapToResDTO(animal);
  }

  public async createOne(
    createAnimalDTO: CreateAnimalDTO,
  ): Promise<AnimalResDTO> {
    const {
      name,
      type,
      description,
    }: { name: string; type: AnimalType; description: string } =
      createAnimalDTO;
    const newAnimal: Animal = new Animal(name, type, description);
    const animal: Animal = await this.filesRepository.createOne(newAnimal);
    return AnimalDTOMapper.mapToResDTO(animal);
  }

  public async updateOne(
    id: string,
    updateAnimalDTO: UpdateAnimalDTO,
  ): Promise<AnimalResDTO> {
    const animal: Animal = await this.filesRepository.updateOne(
      id,
      updateAnimalDTO,
    );
    return AnimalDTOMapper.mapToResDTO(animal);
  }

  public async removeOne(id: string): Promise<boolean> {
    return await this.filesRepository.removeOne(id);
  }

  public async createMany(
    createAnimalDTOs: CreateAnimalDTO[],
  ): Promise<AnimalResDTO[]> {
    await Promise.all(
      createAnimalDTOs.map(async (animalDTO: CreateAnimalDTO) => {
        if (
          await this.filesRepository.isExisting(animalDTO.name, animalDTO.type)
        ) {
          throw new ConflictException(
            `Aninmal with name: ${animalDTO.name} and type: ${animalDTO.type} already exists`,
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
      return AnimalDTOMapper.mapToResDTO(animal);
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
      return AnimalDTOMapper.mapToResDTO(animal);
    });
  }
}