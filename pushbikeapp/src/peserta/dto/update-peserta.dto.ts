import { PartialType } from '@nestjs/mapped-types';
import { CreatePesertaDto } from './create-peserta.dto';

export class UpdatePesertaDto extends PartialType(CreatePesertaDto) {}
