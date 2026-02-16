import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/common/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await this.hashService.hashPassword(createUserDto.password)
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password_hash: passwordHash
    })
    return await this.usersRepository.save(newUser)
  }
}
