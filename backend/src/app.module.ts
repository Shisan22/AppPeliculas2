import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { PeliculasModule } from './peliculas/peliculas.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [PrismaModule, PeliculasModule, AuthModule],
})
export class AppModule {}
