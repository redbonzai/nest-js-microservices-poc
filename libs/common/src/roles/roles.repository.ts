import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AbstractDocument, AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleDocument } from '@app/common/roles/models/role.schema';
import { PermissionDocument } from '@app/common/permissions/models/guards/permission.schema';
import { Permission } from '@app/common/permissions/interfaces';

@Injectable()
export class RolesRepository extends AbstractRepository<AbstractDocument> {
  protected readonly logger = new Logger(RolesRepository.name);
  private roleModel: Model<RoleDocument>;
  private permissionModel: Model<PermissionDocument>;

  constructor(
    @InjectModel(RoleDocument.name)
    roleModel: Model<RoleDocument>,
    @InjectModel(PermissionDocument.name)
    permissionModel: Model<PermissionDocument>,
  ) {
    super(roleModel);
    this.roleModel = roleModel;
    this.permissionModel = permissionModel;
  }

  async addPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument> {
    const role = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const permission: Permission =
      await this.permissionModel.findById(permissionId);
    console.log('PERMISSION: ', permission);

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }

    // Convert ObjectId to string for comparison
    const permissionIdStr = permission._id.toString();

    // Check if permission already exists in the role
    if (!role.permissions.some((pid) => pid.toString() === permissionIdStr)) {
      role.permissions.push(permission._id); // Push the ObjectId
      return role.save();
    }
    throw new BadRequestException(`Permission already assigned to role`);
  }

  async syncPermissions(
    roleId: string,
    permissionNames: string[],
  ): Promise<RoleDocument> {
    const role: RoleDocument = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Find permissions by names
    const permissions: Permission[] = await this.permissionModel.find({
      name: { $in: permissionNames },
    });

    // Set role's permissions
    role.permissions = permissions.map(
      (permission: Permission) => permission._id,
    );
    return role;
  }
}
