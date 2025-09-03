/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lomba } from './entities/lomba.entity';
import { CreateLombaDto } from './dto/create-lomba.dto';
import { UpdateLombaDto } from './dto/update-lomba.dto';

@Injectable()
export class LombaService {
  constructor(
    @InjectRepository(Lomba)
    private readonly lombaRepo: Repository<Lomba>,
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
  const lomba = await this.lombaRepo.findOneBy({ id });
  if (!lomba) throw new NotFoundException('Lomba tidak ditemukan');

  return this.lombaRepo.remove(lomba);
}

}


