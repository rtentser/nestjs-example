import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashModule } from '../common/hash/hash.module';
import { AuthModule } from '../common/auth/auth.module';
import { Article } from '../articles/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Article]), HashModule, AuthModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
