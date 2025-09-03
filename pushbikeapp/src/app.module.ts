/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { EmailModule } from './email/email.module';
import { LombaModule } from './lomba/lomba.module';
import { PesertaModule } from './peserta/peserta.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost', // default ke localhost (XAMPP)
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root', // default root
      password: process.env.DB_PASSWORD || '',      // default kosong di XAMPP
      database: process.env.DB_DATABASE || 'pushbikeweb', // default db name
      entities: [User],
      synchronize: true, // ⚠️ aktifkan hanya untuk development
      autoLoadEntities: true, // supaya semua entity diimport otomatis
    }),
    UsersModule,
    EmailModule,
    LombaModule,
    PesertaModule,
  ],
})
export class AppModule {}
