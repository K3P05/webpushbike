/* eslint-disable prettier/prettier */
// src/peserta/peserta.controller.ts
import { Controller, Post, Body, Param, Get, ParseIntPipe } from '@nestjs/common';
import { PesertaService } from './peserta.service';
import { CreatePesertaDto } from './dto/create-peserta.dto';

@Controller('lomba/:id/peserta')
export class PesertaController {
  constructor(private readonly pesertaService: PesertaService) {}

  @Post()
  create(
    @Param('id', ParseIntPipe) lombaId: number,
    @Body() dto: CreatePesertaDto,
  ) {
    return this.pesertaService.create(lombaId, dto);
  }

  @Get()
  findAll(@Param('id', ParseIntPipe) lombaId: number) {
    return this.pesertaService.findAllByLomba(lombaId);
  }
}
