import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesRepository } from '@app/common/roles/roles.repository';
import { RoleDocument, RoleSchema } from '@app/common/roles/models/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PermissionDocument,
  PermissionSchema,
} from '@app/common/permissions/models/guards/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoleDocument.name, schema: RoleSchema },
      { name: PermissionDocument.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
})
export class RolesModule {}
