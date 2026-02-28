import { ApiHideProperty } from '@nestjs/swagger';
import { Article } from '../../articles/entities/article.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @ApiHideProperty()
  @Column({ select: false })
  password_hash: string;

  @ApiHideProperty()
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
