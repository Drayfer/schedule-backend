import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { UpdateOptionDto } from './dto/update-option.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all/:id')
  findAll(@Param('id') id: string) {
    return this.optionService.findAll(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateOptionDto) {
    return this.optionService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('statistic/:userId')
  getSttistic(@Param('userId') userId: string) {
    return this.optionService.getSttistic(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('statistic/chart/:userId/utc/:utcMinutes')
  getChart(
    @Param('userId') userId: string,
    @Param('utcMinutes') utcMinutes: string,
  ) {
    return this.optionService.getChart(Number(userId), Number(utcMinutes));
  }

  @UseGuards(JwtAuthGuard)
  @Post('notification/:userId')
  createNotification(
    @Body() dto: CreateNotificationDto,
    @Param('userId') userId: string,
  ) {
    return this.optionService.createNotification(dto, Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('notification/:noteId/:userId')
  removeNotification(
    @Param('noteId') noteId: string,
    @Param('userId') userId: string,
  ) {
    return this.optionService.removeNotification(
      Number(noteId),
      Number(userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('notification/:userId')
  editNotification(
    @Body() dto: CreateNotificationDto,
    @Param('userId') userId: string,
  ) {
    return this.optionService.editNotification(dto, Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('all/:userId')
  allCompleteNotifications(@Param('userId') userId: string) {
    return this.optionService.allCompleteNotifications(Number(userId));
  }

  // @UseGuards(JwtAuthGuard)
  @Get('locale/:userId/:locale')
  setLocale(@Param('userId') userId: string, @Param('locale') locale: string) {
    return this.optionService.setLocale(Number(userId), locale);
  }

  @Post('webview/token/:userId')
  updateWebviewToken(
    @Body() dto: { webviewToken: string },
    @Param('userId') userId: string,
  ) {
    return this.optionService.updateWebviewToken(
      dto.webviewToken,
      Number(userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/billinginfo/:userId')
  getBillingInfo(@Param('userId') userId: string) {
    return this.optionService.getBillingInfo(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createmerchant/:userId')
  createMerchant(
    @Body() dto: { amount: number },
    @Param('userId') userId: string,
  ) {
    return this.optionService.createMerchant(Number(userId), dto.amount);
  }

  @Post('/confirmmerchant')
  @Redirect()
  async confirmMerchant(@Body() dto: any) {
    await this.optionService.confirmMerchant(dto);
    if (dto.response_status === 'success') {
      return { url: `${process.env.MERCHANT_PASS}/dashboard?success` };
    }
  }
}
