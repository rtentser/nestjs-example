import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Author {
  @IsString()
  @IsOptional()
  username?: string;
}

export class FilterArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  publication_date?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => Author)
  author?: Author;
}
