import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Services } from '@fmpm/constants';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Services.AUTH_SERVICE) private readonly auth_client: ClientProxy
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
