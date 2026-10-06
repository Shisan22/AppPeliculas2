import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePeliculaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  imagen: string;

  @IsString()
  @IsNotEmpty()
  genero: string;

  @IsInt()
  anio: number;
}
