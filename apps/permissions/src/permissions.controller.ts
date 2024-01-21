import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  getHello(): string {
    return this.permissionsService.getHello();
  }
}
