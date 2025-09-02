/* eslint-disable prettier/prettier */
// src/peserta/peserta.controller.ts
import { Controller, Post, Body, Param, Get, ParseIntPipe } from '@nestjs/common';
import { PesertaService } from './peserta.service';
import { CreatePesertaDto } from './dto/create-peserta.dto';
import { UpdateBatchDto } from './dto/update-peserta.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UpdatePointSesiDto } from './dto/update-point-sesi.dto';
import { UpdatePointSesiBulkDto } from './dto/update-point-sesi-bulk.dto';

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

    @Post('batch')
  updateBatch(
    @Param('id', ParseIntPipe) lombaId: number,
    @Body() dto: UpdateBatchDto,
  ) {
    return this.pesertaService.updateBatch(lombaId, dto);
  }

   // ✅ Tambahan endpoint update point sesi
  // src/peserta/peserta.controller.ts
@Post('pointsesi')
  updatePointSesi(
    @Param('id', ParseIntPipe) lombaId: number,
    @Body() dto: UpdatePointSesiBulkDto,
  ) {
    // cukup kirim dto saja
    return this.pesertaService.updatePointSesiBulk(lombaId, dto.data);
  }

  
}

