import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { AnimalSpecies } from './entity/Animal-species.enum';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get('all')
  async findAll() {
    return await this.animalsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.animalsService.findOne(id);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateAnimalDTO: UpdateAnimalDTO,
  ) {
    return await this.animalsService.updateOne(id, updateAnimalDTO);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return await this.animalsService.removeOne(id);
  }

  @Post('add')
  async createOne(@Body() createAnimalDTO: CreateAnimalDTO) {
    return await this.animalsService.createOne(createAnimalDTO);
  }

  @Post('add/animals')
  createMany(@Body() createAnimalDTOs: CreateAnimalDTO[]) {
    return this.animalsService.createMany(createAnimalDTOs);
  }

  @Post('add/:species')
  createManyOfType(
    @Param('species') species: AnimalSpecies,
    @Body() createAnimalDTOs: CreateAnimalDTO[],
  ) {
    return this.animalsService.creatingManyOfType(species, createAnimalDTOs);
  }
}
