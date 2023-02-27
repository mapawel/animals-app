import { CreateAnimalDTO } from './create-animal.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAnimalDTO extends PartialType(CreateAnimalDTO) {}
