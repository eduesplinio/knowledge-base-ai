import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty({
    example: 'Documentação Frontend',
    description: 'Nome do espaço',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Espaço para artigos sobre React, Next.js, etc',
    description: 'Descrição do espaço',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
