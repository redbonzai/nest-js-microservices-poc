import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto';
import { UpdatePermissionDto } from './dto';
import { AbstractDocument } from '@app/common';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Post('create')
  create(
    @Body() CreatePermissionDto: CreatePermissionDto,
  ): Promise<AbstractDocument> {
    return this.permissionsService.create(CreatePermissionDto);
  }

  @Get()
  findAll(): Promise<AbstractDocument[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AbstractDocument> {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<AbstractDocument> {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<AbstractDocument> {
    return this.permissionsService.remove(id);
  }

  @Post('batch')
  async upsertPermissions(@Body() permissionNames: string[]): Promise<void> {
    try {
      await this.permissionsService.upsertPermissions(permissionNames);
    } catch (error) {
      this.logger.error('PermissionUpsertException', error);
      throw new Error('Error upserting permissions');
    }
  }
}
