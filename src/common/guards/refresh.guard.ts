import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor (private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const [tokenType, token] = request.headers.authorization?.split(' ') ?? []

        if (tokenType !== 'Refresh') {
            throw new UnauthorizedException('Invalid token')
        }

        const payload = await this.authService.getPayload(tokenType, token)
        request['user'] = payload

        return true
    }
}   