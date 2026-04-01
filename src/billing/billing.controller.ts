import {
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Body,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('prices')
  @HttpCode(200)
  async getPrices() {
    return this.billingService.getPrices();
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
    @Headers('paddle-signature') signature: string,
  ) {
    return this.billingService.handleWebhook(body, signature);
  }
}
