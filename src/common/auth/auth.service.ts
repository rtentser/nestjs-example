import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async generateTokens(user: User) {
        const payload = {username: user.username, uid: user.id, type: 'JWT'}
        const jwt = await this.jwtService.signAsync(payload)
        const refresh = await this.jwtService.signAsync({...payload, type: 'REFRESH'}, {expiresIn: '7d'})
        return ({jwt, refresh})
    }

    async verifyToken(token: string) {
        return await this.jwtService.verifyAsync(token)
    }
}
