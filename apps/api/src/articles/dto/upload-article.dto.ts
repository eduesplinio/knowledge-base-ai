import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class UploadArticleDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do espaço ao qual o artigo pertence',
  })
  @IsString()
  @IsNotEmpty()
  spaceId!: string;

  @ApiProperty({
    example: ['markdown', 'documentação'],
    description: 'Tags do artigo',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
