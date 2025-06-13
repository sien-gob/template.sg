import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateApiDto {
  constructor(data?: Partial<CreateApiDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsUrl(
  //   {
  //     require_tld: false,
  //     allow_underscores: true,
  //     protocols: ['http', 'https'],
  //   },
  //   { message: 'La URL proporcionada no es válida' },
  // )
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;
}
