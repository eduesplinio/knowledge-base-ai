import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty({
    example: 'Documentação Frontend',
    description: 'Nome do space',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Space para artigos sobre React, Next.js, etc',
    description: 'Descrição do space',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
