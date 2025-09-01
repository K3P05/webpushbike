/* eslint-disable prettier/prettier */
// src/batch/dto/create-batch.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateBatchDto {
  @IsInt()
  @Min(1)
  jumlahBatch: number;
}
