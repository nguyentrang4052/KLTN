import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  planName: string;

  @IsEnum(['monthly', 'yearly'])
  billing: 'monthly' | 'yearly';

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

export class CancelSubscriptionDto {
  @IsString()
  @IsOptional()
  reason: string;
}

export class ConfirmPaymentDto {
  @IsString()
  @IsNotEmpty()
  transactionRef: string;

  @IsOptional()
  @IsEnum(['success', 'failed'])
  result: 'success' | 'failed';
}

export class RefundDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;
}
