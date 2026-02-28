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
import { ArticleQueryDto } from './dto/filter-article.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Article } from './entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Create new article' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    createArticleDto.username = req.user.username as string;
    return this.articlesService.create(createArticleDto);
  }

  @ApiOperation({ summary: 'Get all articles or articles by criteria' })
  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@Query() query: ArticleQueryDto) {
    return this.articlesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get specific article by id' })
  @ApiOkResponse({ type: Article })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update article by id' })
  @ApiOkResponse({ type: Article })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Delete article by id' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.articlesService.remove(+id, req.user.username);
  }
}
