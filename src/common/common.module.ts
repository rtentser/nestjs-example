import { Module } from '@nestjs/common';
import { JwtModule } from './jwt/jwt.module';
import { HashModule } from './hash/hash.module';

@Module({
  imports: [JwtModule, HashModule]
})
export class CommonModule {}
