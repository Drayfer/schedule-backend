import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { AuthModule } from '../auth/auth.module';
import { OptionEntity } from '../option/entities/option.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([OptionEntity])],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
