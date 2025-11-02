import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Como usar React Hooks',
    description: 'Título do artigo',
  })
  @IsString({ message: 'Título deve ser uma string' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title!: string;

  @ApiProperty({
    example:
      'React Hooks são funções que permitem usar state e outros recursos do React sem escrever uma classe...',
    description: 'Conteúdo do artigo',
  })
  @IsString({ message: 'Conteúdo deve ser uma string' })
  @IsNotEmpty({ message: 'Conteúdo é obrigatório' })
  content!: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do espaço ao qual o artigo pertence',
  })
  @IsMongoId({ message: 'spaceId deve ser um ID MongoDB válido' })
  @IsNotEmpty({ message: 'spaceId é obrigatório' })
  spaceId!: string;

  @ApiProperty({
    example: ['react', 'hooks', 'frontend'],
    description: 'Tags do artigo',
    required: false,
    type: [String],
  })
  @IsArray({ message: 'Tags deve ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  @IsOptional()
  tags?: string[];
}
