import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyncUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Eduardo Esplinio' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  githubId!: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/12345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}
