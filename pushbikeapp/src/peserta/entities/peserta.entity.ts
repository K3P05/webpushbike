/* eslint-disable prettier/prettier */
// src/peserta/entities/peserta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lomba } from '../../lomba/entities/lomba.entity';

export type Kategori = 'boy' | 'girl';

@Entity({ name: 'peserta' })
export class Peserta {
  @PrimaryGeneratedColumn()
  id_pendaftaran: number;

  @Column({ length: 200 })
  nama: string;

  @Column({ length: 50 })
  plat_number: string;

  @Column({ length: 100 })
  community: string;

  @Column({ type: 'int', default: 0 })
  point1: number;

  @Column({ type: 'int', default: 0 })
  point2: number;

  @Column({ type: 'enum', enum: ['boy', 'girl'] })
  kategori: Kategori;

  @Column({ type: 'enum', enum: ['transfer','midtrans','cod'], default: 'transfer' })
  metode_pembayaran: string;

  @ManyToOne(() => Lomba, (lomba) => lomba.peserta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lomba_id' })
  lomba: Lomba;
}
