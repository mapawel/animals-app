import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AnimalsService } from '../provider/animals.service';
import { CreateAnimalDTO } from '../dto/create-animal.dto';
import { UpdateAnimalDTO } from '../dto/update-animal.dto';
import { CreateManyAnimalsDTO } from '../dto/create-many-animals.dto';
import { AnimalType } from '../entity/Animal-type.enum';
import { ParseUUIDPipe, ParseEnumPipe } from '@nestjs/common';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post('test/:id')
  test(@Param('id') id: number) {
    console.log('id ----> ', typeof id);
    return id;
  }

  @Get('all')
  async findAll() {
    return await this.animalsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return await this.animalsService.findOne(id);
  }

  @Post('add')
  async createOne(@Body() createAnimalDTO: CreateAnimalDTO) {
    return await this.animalsService.createOne(createAnimalDTO);
  }

  @Patch(':id')
  async updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnimalDTO: UpdateAnimalDTO,
  ) {
    return await this.animalsService.updateOne(id, updateAnimalDTO);
  }

  @Delete(':id')
  async removeOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalsService.removeOne(id);
  }

  @Post('add/animals')
  async createMany(@Body() createAnimalDTOs: CreateAnimalDTO[]) {
    return await this.animalsService.createMany(createAnimalDTOs);
  }

  @Post('add/:type')
  async createManyOfType(
    @Param('type', new ParseEnumPipe(AnimalType)) type: AnimalType,
    @Body() createAnimalDTOs: CreateManyAnimalsDTO[],
  ) {
    return await this.animalsService.creatingManyOfType(type, createAnimalDTOs);
  }
}