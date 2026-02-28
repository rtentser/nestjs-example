import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import {
  ApiHeader,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Tokens } from 'src/common/auth/auth.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new user and get api tokens' })
  @ApiCreatedResponse({
    description: 'Successful registration',
    type: Tokens,
    example: { jwt: 'JWT Token', refresh: 'Refresh token' },
  })
  @ApiBadRequestResponse({
    example: {
      message: ['email must be an email', 'email must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get api tokens for existing tokens' })
  @ApiCreatedResponse({
    description: 'Successful registration',
    type: Tokens,
    example: { jwt: 'JWT Token', refresh: 'Refresh token' },
  })
  @ApiBadRequestResponse({
    example: {
      message: ['username must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiForbiddenResponse({
    example: {
      message: 'Forbidden',
      statusCode: 403,
    },
  })
  @Post('signin')
  signin(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @ApiOperation({
    summary: 'Get new tokens by refresh token',
  })
  @ApiOkResponse({
    description: 'Successful registration',
    type: Tokens,
    example: { jwt: 'JWT Token', refresh: 'Refresh token' },
  })
  @ApiForbiddenResponse({
    example: {
      message: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Refresh token, starts with Refresh',
  })
  @UseGuards(RefreshGuard)
  @Get('refresh')
  refresh(@Request() req) {
    return this.usersService.refreshTokens(req.user.username);
  }
}
