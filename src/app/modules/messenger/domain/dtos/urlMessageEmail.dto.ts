// src/app/modules/notification/domain/dtos/urlMessage.dto.ts
export class UrlMessageEmailDto {
  title: string;
  description: string;
  url: string;
  buttonText?: string;
  additionalInfo?: string;
  origin: string;
  receptor: string;
}
