/* eslint-disable prettier/prettier */
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe 
} from '@nestjs/common';
import { LombaService } from './lomba.service';
import { CreateLombaDto } from './dto/create-lomba.dto';
import { Lomba } from './entities/lomba.entity';
import { UpdateLombaDto } from './dto/update-lomba.dto';
import { CreateBatchDto } from '../batch/dto/create-batch.dto';

@Controller('lomba')
export class LombaController {
  constructor(private readonly lombaService: LombaService) {}

  @Get()
  findAll(): Promise<Lomba[]> {
    return this.lombaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Lomba> {
  return this.lombaService.findOne(id);
}

  @Post()
  create(@Body() dto: CreateLombaDto): Promise<Lomba> {
    console.log("Received DTO:", dto);
    return this.lombaService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateLombaDto
  ) {
    return this.lombaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lombaService.remove(id);
  }

  @Patch(':id/batch')
setBatch(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: CreateBatchDto,
) {
  return this.lombaService.setBatch(id, dto.jumlahBatch);
}

}
