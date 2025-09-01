/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lomba } from '../../lomba/entities/lomba.entity';

@Entity({ name: 'batch' })
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string; // contoh "Batch 1", "Batch 2"

  @Column({ nullable: true })
  keterangan?: string;

  @ManyToOne(() => Lomba, (lomba) => lomba.batch, { onDelete: 'CASCADE' })
  lomba: Lomba;
}
