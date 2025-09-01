/* eslint-disable prettier/prettier */
// src/lomba/lomba.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lomba } from './entities/lomba.entity';
import { Batch } from '../batch/entities/batch.entity';
import { LombaService } from './lomba.service';
import { LombaController } from './lomba.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lomba, Batch])],
  controllers: [LombaController],
  providers: [LombaService],
  exports: [LombaService],
})
export class LombaModule {}
