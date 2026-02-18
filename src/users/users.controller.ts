import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Post('signin')
  signin(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto)
  }

  @UseGuards(JwtGuard)
  @Get('refresh')
  refresh(@Request() req) {
    return this.usersService.refreshTokens(req.user.username);
  }
}
