/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lomba } from './entities/lomba.entity';
import { CreateLombaDto } from './dto/create-lomba.dto';
import { UpdateLombaDto } from './dto/update-lomba.dto';

// 🔹 Tambahkan import untuk Batch dan DTO Batch
import { Batch } from '../batch/entities/batch.entity';
import { CreateBatchDto } from '../batch/dto/create-batch.dto';

@Injectable()
export class LombaService {
  constructor(
    @InjectRepository(Lomba)
    private readonly lombaRepo: Repository<Lomba>,

    @InjectRepository(Batch) // 🔹 tambahkan repo batch
    private readonly batchRepo: Repository<Batch>,
  ) {}

  async findAll(): Promise<Lomba[]> {
    return this.lombaRepo
      .createQueryBuilder('lomba')
      .loadRelationCountAndMap('lomba.pesertaCount', 'lomba.peserta') // ✅ hitung jumlah peserta
      .getMany();
  }

  async findOne(id: number): Promise<Lomba> {
  const lomba = await this.lombaRepo
    .createQueryBuilder('lomba')
    .where('lomba.id = :id', { id })
    .loadRelationCountAndMap('lomba.pesertaCount', 'lomba.peserta')
    .getOne();

  if (!lomba) throw new NotFoundException(`Lomba dengan id ${id} tidak ditemukan`);
  return lomba;
}


  create(dto: CreateLombaDto): Promise<Lomba> {
    const lomba = this.lombaRepo.create(dto);
    return this.lombaRepo.save(lomba);
  }

  async update(id: number, dto: UpdateLombaDto) {
    const lomba = await this.lombaRepo.findOneBy({ id });
    if (!lomba) throw new NotFoundException('Lomba tidak ditemukan');

    Object.assign(lomba, dto);
    return this.lombaRepo.save(lomba);
  }

  async remove(id: number) {
    const lomba = await this.lombaRepo.findOneBy({ id });
    if (!lomba) throw new NotFoundException('Lomba tidak ditemukan');

    return this.lombaRepo.remove(lomba);
  }

  // 🔹 Tambahkan batch ke lomba
  async addBatch(lombaId: number, dto: CreateBatchDto): Promise<Batch> {
    const lomba = await this.lombaRepo.findOne({ where: { id: lombaId } });
    if (!lomba) {
      throw new NotFoundException(`Lomba dengan id ${lombaId} tidak ditemukan`);
    }

    const batch = this.batchRepo.create({ ...dto, lomba });
    return this.batchRepo.save(batch);
  }

  // Tambah method untuk set jumlah batch
// src/lomba/lomba.service.ts
async setBatch(lombaId: number, jumlahBatch: number): Promise<Lomba> {
  const lomba = await this.lombaRepo.findOne({ where: { id: lombaId }, relations: ['batch', 'peserta'] });
  if (!lomba) throw new NotFoundException(`Lomba dengan id ${lombaId} tidak ditemukan`);

  // update jumlah batch di lomba
  lomba.jumlahBatch = jumlahBatch;
  await this.lombaRepo.save(lomba);

  // hapus batch lama (jika ada)
  if (lomba.batch.length > 0) {
    await this.batchRepo.remove(lomba.batch);
  }

  // buat batch baru
  const newBatches: Batch[] = [];
  for (let i = 1; i <= jumlahBatch; i++) {
    const batch = this.batchRepo.create({
      nama: `Batch ${i}`,
      lomba,
    });
    newBatches.push(batch);
  }

  await this.batchRepo.save(newBatches);

  return lomba;
}


}
