import { UserModule } from './../user/user.module';
import { UserEntity } from './../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.PRIVAT_KEY || 'secret',
      signOptions: { expiresIn: '20d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
