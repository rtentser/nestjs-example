import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CommonModule } from './common/common.module';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'nest_db',
      entities: [User, Article],
      synchronize: false,
      migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
    }),
    UsersModule,
    CommonModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
