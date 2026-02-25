import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { FilterArticleDto } from './dto/filter-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,

    private usersService: UsersService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    if (!createArticleDto.username)
      throw new UnauthorizedException('Author not found');

    const user = await this.usersService.getUserByUsername(
      createArticleDto.username,
    );

    if (!user) throw new UnauthorizedException('Author not found');

    const newArticle = this.articlesRepository.create({
      ...createArticleDto,
      author: user,
    });

    await this.articlesRepository.insert(newArticle);

    return newArticle;
  }

  findAll(limit: number, offset: number, filter: FilterArticleDto) {
    return this.articlesRepository.find({
      take: limit,
      skip: offset,
      where: filter,
    });
  }

  async findOne(id: number) {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!article) throw new NotFoundException('The article not found');

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    if (!updateArticleDto.username)
      throw new UnauthorizedException('Author not found');

    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!article) throw new NotFoundException('The article not found');

    if (article.author.username !== updateArticleDto.username)
      throw new UnauthorizedException('Wrong author');

    delete updateArticleDto.username;
    const updatedArticle = { ...article, ...updateArticleDto };
    await this.articlesRepository.update(article, updatedArticle);
    return updatedArticle;
  }

  async remove(id: number, username: string) {
    if (!username) throw new UnauthorizedException('Author not found');

    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!article) throw new NotFoundException('The article not found');

    if (article.author.username !== username)
      throw new UnauthorizedException('Wrong author');

    await this.articlesRepository.remove(article);

    return `The article ${id} removed`;
  }
}
