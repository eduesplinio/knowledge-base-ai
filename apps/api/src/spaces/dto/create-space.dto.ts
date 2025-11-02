import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty({
    example: 'Documentação Frontend',
    description: 'Nome do espaço',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @ApiProperty({
    example: 'Espaço para artigos sobre React, Next.js, etc',
    description: 'Descrição do espaço',
    required: false,
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsOptional()
  description?: string;
}
