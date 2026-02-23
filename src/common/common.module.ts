import { Module } from '@nestjs/common';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HashModule, AuthModule],
})
export class CommonModule {}
