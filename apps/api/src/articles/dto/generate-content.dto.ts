import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class GenerateContentDto {
  @ApiProperty({
    example: 'Escreva um artigo sobre TypeScript',
    description: 'Prompt para gerar o conteúdo',
  })
  @IsString({ message: 'Prompt deve ser uma string' })
  @IsNotEmpty({ message: 'Prompt é obrigatório' })
  @MaxLength(1000, { message: 'Prompt deve ter no máximo 1000 caracteres' })
  prompt!: string;

  @ApiProperty({
    example: 0.7,
    description: 'Temperatura (0-2)',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Temperatura deve ser um número' })
  @Min(0, { message: 'Temperatura deve ser no mínimo 0' })
  @Max(2, { message: 'Temperatura deve ser no máximo 2' })
  temperature?: number;

  @ApiProperty({
    example: 2000,
    description: 'Máximo de tokens',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'maxTokens deve ser um número' })
  @Min(100, { message: 'maxTokens deve ser no mínimo 100' })
  @Max(4000, { message: 'maxTokens deve ser no máximo 4000' })
  maxTokens?: number;
}
