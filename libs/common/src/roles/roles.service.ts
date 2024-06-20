import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from '@app/common/roles/roles.repository';
import { AbstractDocument } from '@app/common';
import { RoleDocument } from '@app/common/roles/models/role.schema';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}
  create(createRoleDto: CreateRoleDto): Promise<AbstractDocument> {
    return this.roleRepository.create(createRoleDto);
  }

  findAll(): Promise<AbstractDocument[]> {
    return this.roleRepository.find({});
  }

  findOne(_id: string): Promise<AbstractDocument> {
    return this.roleRepository.findOne({ _id });
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Promise<AbstractDocument> {
    return this.roleRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateRoleDto },
    );
  }

  async remove(id: string): Promise<AbstractDocument> {
    return await this.roleRepository.findOneAndDelete({ _id: id });
  }

  async addPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RoleDocument> {
    return await this.roleRepository.addPermissionToRole(roleId, permissionId);
  }

  async syncPermissions(
    roleId: string,
    permissionNames: string[],
  ): Promise<RoleDocument> {
    return await this.roleRepository.syncPermissions(roleId, permissionNames);
  }
}
