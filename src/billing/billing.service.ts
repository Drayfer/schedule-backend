import { Injectable, BadRequestException } from '@nestjs/common';
import {
  Paddle,
  Environment,
  EventName,
  TransactionPaidEvent,
  TransactionPaymentFailedEvent,
} from '@paddle/paddle-node-sdk';
import { OptionEntity } from '../option/entities/option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class BillingService {
  private readonly paddle: Paddle;
  private readonly webhookSecret: string;

  constructor(
    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
  ) {
    const apiKey = process.env.PADDLE_API_KEY || '';
    const isSandbox = apiKey.includes('pdl_sdbx_apikey');

    this.paddle = new Paddle(apiKey, {
      environment: isSandbox ? Environment.sandbox : Environment.production,
    });

    this.webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';
  }

  async getPrices() {
    const txn = await this.paddle.transactions.create({
      items: [
        {
          quantity: 1,
          price: {
            customData: {
              period: 'month',
            },
            description:
              'Unlock all T-App Premium features: exclusive tools, priority support, advanced settings, and detailed usage statistics.',
            unitPrice: {
              currencyCode: 'USD',
              amount: '200',
            },
            product: {
              name: 'T-App Premium Access Month',
              description:
                'Unlock all T-App Premium features: exclusive tools, priority support, advanced settings, and detailed usage statistics.',
              taxCategory: 'saas',
            },
            quantity: {
              maximum: 1,
              minimum: 1,
            },
          },
        },
        {
          quantity: 1,
          price: {
            customData: {
              period: 'year',
            },
            description:
              'Unlock all T-App Premium features: exclusive tools, priority support, advanced settings, and detailed usage statistics.',
            unitPrice: {
              currencyCode: 'USD',
              amount: '1400',
            },
            product: {
              name: 'T-App Premium Access Year',
              description:
                'Unlock all T-App Premium features: exclusive tools, priority support, advanced settings, and detailed usage statistics.',
              taxCategory: 'saas',
            },
            quantity: {
              maximum: 1,
              minimum: 1,
            },
          },
        },
      ],
    });

    return txn;
  }

  async handleWebhook(rawBody: object, signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing paddle-signature header');
    }

    const rawRequestBody = JSON.stringify(rawBody);

    try {
      // Верификация подписи и парсинг события через unmarshal
      const eventData = await this.paddle.webhooks.unmarshal(
        rawRequestBody,
        this.webhookSecret,
        signature,
      );

      // Обработка событий оплаты
      switch (eventData.eventType) {
        case EventName.TransactionPaid:
          await this.handleTransactionPaid(eventData);
          break;
        case EventName.TransactionPaymentFailed:
          await this.handlePaymentFailed(eventData);
          break;
        default:
          console.error(
            `[Paddle Webhook] Unhandled event type: ${eventData.eventType}`,
          );
      }

      return { received: true, eventType: eventData.eventType };
    } catch (error) {
      console.error('[Paddle Webhook] Error:', error);
      throw error;
    }
  }

  private async handleTransactionPaid(eventData: TransactionPaidEvent) {
    const data = eventData.data;
    const userId = data.customData?.userId;

    if (!userId) {
      console.error('[Paddle] No userId in customData, skipping');
      return;
    }

    const { paid } = await this.optionRepository.findOneBy({
      userId: Number(userId),
    });
    let newPaid = null;
    const duration = data.items?.[0]?.price?.customData?.period || 'month';
    if (!paid || moment(paid).isBefore(moment())) {
      newPaid = moment().add(1, duration).toDate();
    } else {
      newPaid = moment(paid).add(1, duration).toDate();
    }

    await this.optionRepository.update(
      { userId: Number(userId) },
      {
        paid: newPaid,
      },
    );
  }

  private async handlePaymentFailed(eventData: TransactionPaymentFailedEvent) {
    const data = eventData.data;
    console.error('[Paddle] Payment failed:', {
      transactionId: data.id,
      customerId: data.customerId,
    });

    // Тут можно уведомить пользователя или отключить доступ
  }
}
