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
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  prompt!: string;

  @ApiProperty({
    example: 0.7,
    description: 'Temperatura (0-2)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiProperty({
    example: 2000,
    description: 'Máximo de tokens',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(4000)
  maxTokens?: number;
}
