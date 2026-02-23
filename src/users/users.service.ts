import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from '../common/hash/hash.service';
import { AuthService } from '../common/auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private hashService: HashService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await this.hashService.hashPassword(
      createUserDto.password,
    );
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password_hash: passwordHash,
    });

    const tokens = await this.authService.generateTokens(newUser);
    await this.usersRepository.save(newUser);
    return tokens;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findOneBy({
      username: loginUserDto.username,
    });
    if (
      !user ||
      !(await this.hashService.comparePassword(
        loginUserDto.password,
        user.password_hash,
      ))
    ) {
      throw new ForbiddenException();
    }

    return this.authService.generateTokens(user);
  }

  async refreshTokens(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new ForbiddenException();
    }

    return this.authService.generateTokens(user);
  }
}
