import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from '../common/hash/hash.service';
import { AuthService } from '../common/auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Tokens } from 'src/common/auth/auth.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private hashService: HashService,
    private authService: AuthService,
  ) {}

  /** Create a new user and generate tokens for them */
  async create(createUserDto: CreateUserDto): Promise<Tokens> {
    const passwordHash = await this.hashService.hashPassword(
      createUserDto.password,
    );
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password_hash: passwordHash,
    });

    await this.usersRepository.insert(newUser);

    return this.authService.generateTokens(newUser);
  }

  /** Log into existing user and generate tokens for them */
  async login(loginUserDto: LoginUserDto): Promise<Tokens> {
    const user = await this.usersRepository.findOne({
      where: { username: loginUserDto.username },
      select: ['id', 'username', 'password_hash'],
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

  /** Generate new tokens by refresh token */
  async refreshTokens(username: string): Promise<Tokens> {
    const user = await this.getUserByUsername(username);

    if (!user) {
      throw new ForbiddenException();
    }

    return this.authService.generateTokens(user);
  }

  async getUserByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
