/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Peserta } from '../../peserta/entities/peserta.entity'
import {Batch} from '../../batch/entities/batch.entity'

// src/lomba/entities/lomba.entity.ts
export enum Kategori {
  BOY = 'boy',
  GIRL = 'girl',
}


@Entity({ name: 'lomba' })
export class Lomba {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  nama: string;

  @Column({ type: 'date' })
  tanggal: string;

  @Column()
  jumlahPeserta: number; // kuota

  @Column()
  biaya: number; // biaya pendaftaran

  @Column({ type: 'enum', enum: ['boy','girl'], default: 'boy' })
  kategori: Kategori;

  // src/lomba/entities/lomba.entity.ts
  @Column({ type: 'int', nullable: true })
  jumlahBatch?: number;


  @OneToMany(() => Peserta, peserta => peserta.lomba)
  peserta: Peserta[];

  @OneToMany(() => Batch, (batch) => batch.lomba, { cascade: true })
  batch: Batch[];
}
