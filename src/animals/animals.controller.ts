import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { AnimalSpecies } from './entity/Animal-species.enum';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get('all')
  findAll() {
    return this.animalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() updateAnimalDTO: UpdateAnimalDTO) {
    return this.animalsService.updateOne(id, updateAnimalDTO);
  }

  @Post('add')
  createOne(@Body() createAnimalDTO: CreateAnimalDTO) {
    return this.animalsService.createOne(createAnimalDTO);
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
