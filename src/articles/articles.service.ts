import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,

    private usersService: UsersService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    if (!createArticleDto.username)
      throw new UnauthorizedException('User not found');

    const user = await this.usersService.getUserByUsername(
      createArticleDto.username,
    );

    if (!user) throw new UnauthorizedException();

    const newArticle = this.articlesRepository.create({
      ...createArticleDto,
      author: user,
    });

    return this.articlesRepository.save(newArticle);
  }

  findAll() {
    return `This action returns all articles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
