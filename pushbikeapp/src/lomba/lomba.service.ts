/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Lomba } from './entities/lomba.entity';
import { Peserta } from '../peserta/entities/peserta.entity';
import { CreateLombaDto } from './dto/create-lomba.dto';
import { UpdateLombaDto } from './dto/update-lomba.dto';

@Injectable()
export class LombaService {
  constructor(
    @InjectRepository(Lomba)
    private readonly lombaRepo: Repository<Lomba>,

    @InjectRepository(Peserta)
    private readonly pesertaRepository: Repository<Peserta>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Lomba[]> {
    return this.lombaRepo
      .createQueryBuilder('lomba')
      .loadRelationCountAndMap('lomba.pesertaCount', 'lomba.peserta') // ✅ hitung jumlah peserta
      .getMany();
  }

  async findOne(id: number): Promise<Lomba | null> {
    return this.lombaRepo
      .createQueryBuilder('lomba')
      .where('lomba.id = :id', { id })
      .loadRelationCountAndMap('lomba.pesertaCount', 'lomba.peserta')
      .getOne();
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
    const lomba = await this.lombaRepo.findOne({ where: { id }, relations: ['peserta'] });
    if (!lomba) throw new NotFoundException('Lomba tidak ditemukan');

    // mulai transaction
    return await this.dataSource.transaction(async (manager) => {
      for (const peserta of lomba.peserta) {
        // hapus semua point_sesi terkait peserta
        await manager.query(
          `DELETE FROM point_sesi WHERE pesertaIdPendaftaran = ?`,
          [peserta.id_pendaftaran]
        );

        // hapus peserta
        await manager.delete(Peserta, peserta.id_pendaftaran);
      }

      // hapus lomba
      await manager.delete(Lomba, id);
    });
  }

async simpanHasil(id: number, moto: string, peserta: any[]) {
    for (const p of peserta) {
      await this.pesertaRepository.update(p.id, {
        [moto === "moto1" ? "point1" : "point2"]: 
          p[moto === "moto1" ? "point1" : "point2"],
      });
    }
    return { message: "Hasil berhasil disimpan" };
  }

  

}


