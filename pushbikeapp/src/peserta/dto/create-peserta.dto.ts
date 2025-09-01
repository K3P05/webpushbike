/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
// src/peserta/dto/create-peserta.dto.ts
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Kategori } from '../../lomba/entities/lomba.entity';

export class CreatePesertaDto {
  @IsString() @IsNotEmpty()
  nama: string;

  @IsString() @IsNotEmpty()
  plat_number: string;

  @IsString() @IsNotEmpty()
  community: string;

  @IsEnum(Kategori)
   kategori?: Kategori; 

  @IsEnum(['transfer','midtrans','cod'])
  metodePembayaran: 'transfer' | 'midtrans' | 'cod';
}
