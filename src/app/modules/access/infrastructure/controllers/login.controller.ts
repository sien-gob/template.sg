import { Body, Controller, Post } from "@nestjs/common";
import { ProcessRequest } from "src/system/response/decorators";
import { CredentialDto, LoginDto } from "../../domain/dtos";
import { LoginService } from "../../application/services";

@Controller('auth')
export class LoginController {

  constructor(private readonly loginService:LoginService) {}

  @Post('login')
  @ProcessRequest<LoginDto>()
  async login(@Body() input: CredentialDto): Promise<LoginDto> {
     return await this.loginService.run(input)  
  }
}
