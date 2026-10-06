import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePeliculaDto } from './dto/create-pelicula.dto.js';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto.js';

@Injectable()
export class PeliculasService {
  constructor(private prisma: PrismaService) {}

  /** Crear una nueva película */
  create(createPeliculaDto: CreatePeliculaDto) {
    return this.prisma.pelicula.create({
      data: createPeliculaDto,
    });
  }

  /**
   * Listar películas con búsqueda y paginación.
   * Sin búsqueda: devuelve películas en orden aleatorio con scroll infinito continuo.
   * Con búsqueda: filtra por nombre con paginación estándar.
   */
  async findAll(search?: string, page = 1, limit = 10) {
    if (!search) {
      const data = await this.prisma.$queryRaw`SELECT * FROM Pelicula ORDER BY RANDOM() LIMIT ${limit}`;
      return {
        data,
        total: Number.MAX_SAFE_INTEGER,
        page,
        lastPage: page + 1,
      };
    }

    const where = { nombre: { contains: search } };

    const [data, total] = await Promise.all([
      this.prisma.pelicula.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.pelicula.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /** Obtener una película por su ID */
  findOne(id: number) {
    return this.prisma.pelicula.findUnique({
      where: { id },
    });
  }

  /** Actualizar una película */
  update(id: number, updatePeliculaDto: UpdatePeliculaDto) {
    return this.prisma.pelicula.update({
      where: { id },
      data: updatePeliculaDto,
    });
  }

  /** Eliminar una película */
  remove(id: number) {
    return this.prisma.pelicula.delete({
      where: { id },
    });
  }
}
