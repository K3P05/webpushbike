/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Peserta } from './entities/peserta.entity';
import { CreatePesertaDto } from './dto/create-peserta.dto';
import { Lomba } from '../lomba/entities/lomba.entity';

@Injectable()
export class PesertaService {
  constructor(
    @InjectRepository(Peserta)
    private pesertaRepo: Repository<Peserta>,
    @InjectRepository(Lomba)
    private lombaRepo: Repository<Lomba>,
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
      relations: ['lomba'],
    });

    return peserta.map((p) => ({
      id_pendaftaran: p.id_pendaftaran,
      nama: p.nama,
      kategori: p.kategori,
      platNumber: p.plat_number,
      community: p.community,
      id_lomba: p.lomba.id,
    }));
  }
}
