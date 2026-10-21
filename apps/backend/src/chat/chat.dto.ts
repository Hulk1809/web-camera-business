import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ChatSessionStatus } from '@prisma/client';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateChatSessionDto {
  @IsOptional()
  @IsString()
  @Length(32, 256)
  accessToken?: string;

  @Transform(trim)
  @IsString()
  @Length(1, 100)
  displayName: string;

  @IsOptional()
  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @Length(5, 30)
  phone?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @Length(1, 4000)
  initialMessage?: string;
}

export class ResumeChatDto {
  @IsString()
  @Length(32, 256)
  accessToken: string;
}

export class SendChatMessageDto {
  @Transform(trim)
  @IsString()
  @Length(1, 4000)
  content: string;
}

export class MessageQueryDto {
  @IsOptional()
  @IsUUID()
  after?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class AdminSessionQueryDto {
  @IsOptional()
  @IsEnum(ChatSessionStatus)
  status?: ChatSessionStatus;

  @IsOptional()
  @IsIn(['true', 'false'])
  assignedToMe?: 'true' | 'false';

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsUUID()
  cursor?: string;
}
