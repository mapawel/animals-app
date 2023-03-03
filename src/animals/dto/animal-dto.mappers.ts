import { Animal } from '../entity/Animal';
import { AnimalResDTO } from './animal-res.dto';

export const mapToResDTO = (animal: Animal): AnimalResDTO => {
  return {
    id: animal.id,
    name: animal.name,
    type: animal.type,
    description: animal.description,
  };
};
