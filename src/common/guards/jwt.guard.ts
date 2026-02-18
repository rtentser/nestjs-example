import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor (private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(' ') ?? []

        try {
            const payload = await this.authService.verifyToken(token)
            if (type === 'Bearer' && payload.type !== 'JWT') {
                throw new UnauthorizedException('Invalid token')
            }

            if (type === 'Refresh' && payload.type !== 'REFRESH') {
                throw new UnauthorizedException('Invalid token')
            }
            request['user'] = payload
        } catch {
            throw new UnauthorizedException('Invalid token')
        }

        return true
    }
}   