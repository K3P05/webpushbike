/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In} from 'typeorm';
import { Peserta } from './entities/peserta.entity';
import { CreatePesertaDto } from './dto/create-peserta.dto';
import { Lomba } from '../lomba/entities/lomba.entity';
import { UpdateBatchDto } from './dto/update-peserta.dto';
import { PointSesi } from './entities/point_sesi.entity';
import { UpdatePointSesiDto } from './dto/update-point-sesi.dto';
import { UpdateStatusPembayaranDto } from './dto/update-status-pembayaran.dto';

@Injectable()
export class PesertaService {
  constructor(
    @InjectRepository(Peserta)
    private pesertaRepo: Repository<Peserta>,
    @InjectRepository(Lomba)
    private lombaRepo: Repository<Lomba>,
    @InjectRepository(PointSesi)
    private pointSesiRepo: Repository<PointSesi>,
  ) {}

  async create(lombaId: number, dto: CreatePesertaDto) {
    const lomba = await this.lombaRepo.findOne({
      where: { id: lombaId },
      relations: ['peserta'],
    });

    if (!lomba) throw new BadRequestException('Lomba tidak ditemukan');

    // ✅ cek kuota
    const pesertaCount = lomba.peserta.length;
    if (pesertaCount >= lomba.jumlahPeserta) {
      throw new BadRequestException('Kuota lomba sudah penuh');
    }

    const peserta = this.pesertaRepo.create({
      ...dto,
      lomba,
    });

    return this.pesertaRepo.save(peserta);
  }

  async findAllByLomba(lombaId: number) {
  const peserta = await this.pesertaRepo.find({
    where: { lomba: { id: lombaId } },
    relations: ['lomba', 'pointSesi'],
  });

  return peserta.map((p) => ({
    id_pendaftaran: p.id_pendaftaran,
    nama: p.nama,
    kategori: p.kategori,
    platNumber: p.plat_number,  // sesuaikan jika nama kolom di DB berbeda
    community: p.community,
    id_lomba: p.lomba.id,
    point1: p.point1,   // tambah point1
    point2: p.point2,   // tambah point2
    batch: p.batch,
    pointSesi: p.pointSesi,
    statusPembayaran: p.statusPembayaran,
  }));
} 

async updateBatch(lombaId: number, dto: UpdateBatchDto) {
  const { batch, pesertaIds } = dto;

  if (!pesertaIds || pesertaIds.length === 0) {
    throw new BadRequestException('Tidak ada peserta yang dikirim');
  }

  const lomba = await this.lombaRepo.findOne({ where: { id: lombaId } });
  if (!lomba) throw new BadRequestException('Lomba tidak ditemukan');

  const result = await this.pesertaRepo.update(
    { id_pendaftaran: In(pesertaIds), lomba: { id: lombaId } },
    { batch },
  );

  return {
    message: 'Batch berhasil disimpan',
    batch,
    pesertaIds,
    affected: result.affected,
  };
}


  
  // src/peserta/peserta.service.ts
async updatePointSesiBulk(lombaId: number, data: UpdatePointSesiDto[]) {
  for (const dto of data) {
    const { pesertaId, sesi, finish, point } = dto;

    await this.pointSesiRepo
  .createQueryBuilder()
  .insert()
  .into(PointSesi)
  .values({
    peserta: { id_pendaftaran: pesertaId },
    sesi,
    finish: finish ?? undefined,   // ✅ jangan pakai null
    point: point ?? 0,
  })
  .orUpdate(['finish', 'point'], ['peserta', 'sesi'])
  .execute();

  }

  return { message: "Finish berhasil disimpan", count: data.length };
}

async updateStatusPembayaran(
  lombaId: number,
  pesertaId: number,
  dto: UpdateStatusPembayaranDto,
) {
  const peserta = await this.pesertaRepo.findOne({
    where: { id_pendaftaran: pesertaId, lomba: { id: lombaId } },
  });

  if (!peserta) throw new BadRequestException('Peserta tidak ditemukan');

  peserta.statusPembayaran = dto.statusPembayaran;
  await this.pesertaRepo.save(peserta);

  return {
    message: 'Status pembayaran berhasil diperbarui',
    pesertaId,
    statusPembayaran: dto.statusPembayaran,
  };
}


}





