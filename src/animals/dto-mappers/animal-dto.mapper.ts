import { Animal } from '../entity/Animal';
import { AnimalResDTO } from '../dto/animal-res.dto';

export class AnimalDTOMapper {
  public static mapToResDTO(animal: Animal): AnimalResDTO {
    return {
      id: animal.id,
      name: animal.name,
      type: animal.type,
      description: animal.description,
    };
  }
}
