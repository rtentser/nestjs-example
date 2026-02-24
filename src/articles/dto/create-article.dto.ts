import { IsDateString, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  publication_date: Date;

  username?: string;
}
