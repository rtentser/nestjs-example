import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(user: User) {
    const payload = { username: user.username, uid: user.id, type: 'JWT' };
    const jwt = await this.jwtService.signAsync(payload);
    const refresh = await this.jwtService.signAsync(
      { ...payload, type: 'REFRESH' },
      { expiresIn: '7d' },
    );
    return { jwt, refresh };
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }

  async getPayload(tokenType: string, token: string) {
    let payload;
    try {
      payload = await this.verifyToken(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    if (tokenType === 'Bearer' && payload.type !== 'JWT') {
      throw new UnauthorizedException('Invalid token');
    }

    if (tokenType === 'Refresh' && payload.type !== 'REFRESH') {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }
}
