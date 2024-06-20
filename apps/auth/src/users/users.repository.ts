import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractRepository, UserDocument } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { RoleDocument } from '@app/common/roles/models/role.schema';
import { User } from './interfaces';
import { Permission } from '@app/common/permissions/interfaces';
import { Role } from '@app/common/roles/interfaces/role.interface';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);
  private readonly userModel: Model<UserDocument>;
  private readonly roleModel: Model<RoleDocument>;

  constructor(
    @InjectModel(UserDocument.name) userModel: Model<UserDocument>,
    @InjectModel(RoleDocument.name) roleModel: Model<RoleDocument>,
  ) {
    super(userModel);
    this.userModel = userModel;
    this.roleModel = roleModel;
  }

  async addReservationToUser(
    userId: string,
    reservationId: string,
  ): Promise<void> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const reservationObjectId = new mongoose.Types.ObjectId(reservationId);

    const updateResult = await this.userModel.updateOne(
      { _id: userObjectId },
      { $addToSet: { reservationIds: reservationObjectId } },
    );

    if (updateResult.matchedCount === 0) {
      console.log(`No user found with ID: ${userId}`);
    } else if (updateResult.modifiedCount === 0) {
      console.log(
        `Reservation ID ${reservationId} already exists in user ${userId}`,
      );
    } else {
      console.log('Reservation successfully added to user');
    }
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user: User = await this.userModel.findById(userId).populate({
      path: 'roles',
      populate: { path: 'permissions' },
    });

    console.log('FOUND USER TO GET PERMISSIONS FROM: ', user);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Ensure TypeScript knows the type of 'user'
    // Extract permissions from user roles
    const permissions: string[] = user.roles.reduce((acc, role) => {
      const rolePermissions = role.permissions.map(
        (permission) => permission.name,
      );
      console.log('ROLE PERMISSIONS: ', rolePermissions);
      console.log('ACC: ', acc);
      return [...acc, ...rolePermissions];
    }, []);

    console.log('Permissions: ', permissions);

    return permissions;
  }

  async getUserRolesAndPermissions(userId: string): Promise<any> {
    const user: User = await this.userModel.findById(userId).populate({
      path: 'roles',
      populate: { path: 'permissions' },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      roles: user.roles.map((role: Role) => role.name),
      permissions: user.roles.flatMap((role) =>
        role.permissions.map((permission: Permission) => permission.name),
      ),
    };
  }
}
