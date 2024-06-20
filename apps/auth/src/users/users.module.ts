import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDocument, UserSchema } from '@app/common';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from '@app/common/roles/roles.module';
import { RoleDocument, RoleSchema } from '@app/common/roles/models/role.schema';

@Module({
  imports: [
    RolesModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: RoleDocument.name, schema: RoleSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
