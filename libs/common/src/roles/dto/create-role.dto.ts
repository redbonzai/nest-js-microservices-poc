export class CreateRoleDto {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
}
