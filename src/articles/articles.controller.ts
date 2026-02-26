import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { FilterArticleDto } from './dto/filter-article.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { plainToInstance } from 'class-transformer';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    createArticleDto.username = req.user.username as string;
    return this.articlesService.create(createArticleDto);
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('title') title: number,
    @Query('description') description: number,
    @Query('publication_date') publication_date: number,
    @Query('username') username: number,
  ) {
    const filter = {
      title,
      description,
      publication_date,
      author: {
        username,
      },
    };
    return this.articlesService.findAll(
      limit,
      offset,
      plainToInstance(FilterArticleDto, filter),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req,
  ) {
    updateArticleDto.username = req.user.username as string;
    return this.articlesService.update(+id, updateArticleDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.articlesService.remove(+id, req.user.username);
  }
}
