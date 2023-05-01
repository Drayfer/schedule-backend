import {} from 'class-validator';

export class donatelloDto {
  pubId: string;
  clientName: string;
  message: string;
  amount: string;
  currency: string;
  source: string;
  goal: string;
  isPublished: boolean;
  createdAt: string;
}
